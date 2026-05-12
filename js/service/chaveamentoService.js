import { db } from '../config/supabase.js'

export async function gerarChaveamento() {

  const { error } = await db
    .rpc('gerar_chaveamento')

  if (error) {
    console.error(error)
    throw error
  }
}