import { db } from '../config/supabase.js'

export async function buscarPartidas() {

  const { data, error } = await db
    .from('matches')
    .select(`
      *,
      teamA:team_a(nome),
      teamB:team_b(nome)
    `)

  if (error) {
    console.error(error)
    throw error
  }

  return data
}