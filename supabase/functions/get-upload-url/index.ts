import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3"
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
    const { file_name, file_size, user_uuid, game_id } = await req.json()

    if (!file_name || !file_size || !user_uuid || !game_id) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
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

    // 2. Generate a unique key for the file to prevent collision
    const fileUuid = crypto.randomUUID()
    const ext = file_name.includes('.') ? file_name.split('.').pop() : 'luducard'
    const r2Path = `saves/${game_id}/${fileUuid}.${ext}`

    // 3. Create Presigned Put URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Path,
      ContentLength: file_size,
    })

    // Presigned URL expires in 5 minutes (300 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    return new Response(JSON.stringify({ uploadUrl, r2Path }), {
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
