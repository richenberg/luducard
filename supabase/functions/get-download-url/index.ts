import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { r2_path } = await req.json()

    if (!r2_path) {
      return new Response(JSON.stringify({ error: 'Missing r2_path parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1. Initialize R2 Client using environment variables in Supabase
    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
    const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
    const endpoint = Deno.env.get('R2_ENDPOINT_URL')
    const bucketName = Deno.env.get('R2_BUCKET_NAME')

    if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
      return new Response(JSON.stringify({ error: 'R2 credentials not configured in Supabase. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT_URL and R2_BUCKET_NAME.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    })

    // 2. Create Presigned GET URL
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: r2_path,
    })

    // Presigned URL expires in 15 minutes (900 seconds)
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })

    return new Response(JSON.stringify({ downloadUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
