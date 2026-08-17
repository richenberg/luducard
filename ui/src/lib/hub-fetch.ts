/**
 * Shared loader for the community hub tables (`public_saves`, `public_presets`).
 *
 * Exists so the call sites can tell "the repository answered and it is empty"
 * apart from "we never got an answer". Before this, a swallowed failure and a
 * genuinely empty hub rendered the exact same empty state, so an outage or a
 * DNS problem looked like there was simply nothing available to download.
 */

/** Why a hub request failed, in the shape the UI needs to explain itself. */
export interface HubFetchError {
  /** HTTP status the server answered with; 0 when the request never arrived. */
  status: number
  /** Context for the console — response body, status text, or thrown message. */
  detail: string
}

export type HubFetchResult<T> =
  | { ok: true; rows: T[] }
  | { ok: false; error: HubFetchError }

export async function fetchHubRows<T = any>(
  endpoint: string,
  anonKey: string
): Promise<HubFetchResult<T>> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`
      }
    })
  } catch (err) {
    // fetch only rejects when the request never completed at all: the host
    // failed to resolve, TLS broke, or the machine has no route out.
    return { ok: false, error: { status: 0, detail: String(err) } }
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    return {
      ok: false,
      error: { status: response.status, detail: body.slice(0, 300) || response.statusText }
    }
  }

  try {
    return { ok: true, rows: await response.json() }
  } catch (err) {
    return { ok: false, error: { status: response.status, detail: String(err) } }
  }
}

/**
 * Turns a failure into the title/description shown in place of the empty state.
 * `t` is passed in rather than pulled from a hook so this file stays renderless.
 */
export function describeHubError(
  t: (key: string, defaultValue?: string) => string,
  error: HubFetchError
): { title: string; description: string } {
  if (error.status === 0) {
    return {
      title: t("luducard-hub-unreachable-title", "Could not reach the repository"),
      description: t(
        "luducard-hub-unreachable-desc",
        "The server did not respond. Check your internet connection — if it is working, the repository may be temporarily offline."
      )
    }
  }

  if (error.status === 401 || error.status === 403) {
    return {
      title: t("luducard-hub-rejected-title", "Repository refused the connection"),
      description: t(
        "luducard-hub-rejected-desc",
        "The configured Supabase key was rejected. Check the URL and the Anon Key in Settings."
      )
    }
  }

  return {
    title: t("luducard-hub-error-title", "Repository returned an error"),
    description: `${t(
      "luducard-hub-error-desc",
      "The server answered with an error and the list could not be loaded."
    )} (HTTP ${error.status})`
  }
}
