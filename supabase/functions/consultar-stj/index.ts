import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  )

  const { data, error } = await supabase
    .from('registros_processos')
    .select('processo_superior')
    .match({ tribunal: 'STJ', situacao: 'Em Trâmite' })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const numeros = data.map((r) => r.processo_superior).filter(Boolean)

  return new Response(JSON.stringify(numeros), {
    headers: { 'Content-Type': 'application/json' },
  })
})
