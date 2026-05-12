import { db } from '../config/supabase.js'

export async function buscarClassificacao() {

  const { data, error } = await db
    .from('classificacao_view')
    .select('*')

  if (error) {
    console.error(error)
    throw error
  }

  return data
}