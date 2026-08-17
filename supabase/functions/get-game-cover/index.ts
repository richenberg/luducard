import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const steamgridApiKey = Deno.env.get('STEAMGRIDDB_API_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { gameTitle } = await req.json()
    if (!gameTitle) {
      return new Response(JSON.stringify({ error: 'gameTitle is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const cleanTitle = gameTitle.trim()

    // 1. Check database cache
    const { data: cacheData, error: cacheError } = await supabase
      .from('game_covers')
      .select('cover_url')
      .eq('game_title', cleanTitle)
      .maybeSingle()

    if (cacheData?.cover_url) {
      console.log(`Cache HIT for "${cleanTitle}": ${cacheData.cover_url}`);
      return new Response(JSON.stringify({ coverUrl: cacheData.cover_url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Fetch from SteamGridDB
    if (!steamgridApiKey) {
      return new Response(JSON.stringify({ error: 'SteamGridDB API key is not configured in Supabase environment variables.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Cache MISS for "${cleanTitle}". Querying SteamGridDB...`);

    // Search game ID.
    // The term goes in the path, not in a `?term=` query string: the query form is not a
    // route SteamGridDB serves, so it answered 404 for every title and no cover resolved
    // by name ever worked.
    const searchUrl = `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(cleanTitle)}`
    const searchResp = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${steamgridApiKey}`
      }
    })

    if (!searchResp.ok) {
      return new Response(JSON.stringify({ error: `SteamGridDB search failed with status ${searchResp.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const searchJson = await searchResp.json()
    if (!searchJson.success || !searchJson.data || searchJson.data.length === 0) {
      console.log(`No game found on SteamGridDB for "${cleanTitle}".`);
      return new Response(JSON.stringify({ coverUrl: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const gameId = searchJson.data[0].id

    // Get grid cover images (dimensions=600x900)
    const gridsUrl = `https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900`
    const gridsResp = await fetch(gridsUrl, {
      headers: {
        'Authorization': `Bearer ${steamgridApiKey}`
      }
    })

    if (!gridsResp.ok) {
      return new Response(JSON.stringify({ error: `SteamGridDB grids retrieval failed with status ${gridsResp.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const gridsJson = await gridsResp.json()
    if (!gridsJson.success || !gridsJson.data || gridsJson.data.length === 0) {
      console.log(`No grids found on SteamGridDB for game ID ${gameId}.`);
      return new Response(JSON.stringify({ coverUrl: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Select the first vertical grid image
    const coverUrl = gridsJson.data[0].url

    // 3. Cache the result in public.game_covers table
    const { error: insertError } = await supabase
      .from('game_covers')
      .insert({ game_title: cleanTitle, cover_url: coverUrl })

    if (insertError) {
      console.warn(`Failed to cache cover for "${cleanTitle}":`, insertError);
    } else {
      console.log(`Successfully cached cover for "${cleanTitle}": ${coverUrl}`);
    }

    return new Response(JSON.stringify({ coverUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Edge Function Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
