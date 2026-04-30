// resultado.js

async function definirVencedor(matchId, lado) {
  // Buscar partida
  const { data: match, error } = await supabaseClient
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const winnerId = lado === 'A' ? match.team_a_id : match.team_b_id;

  // Atualiza partida atual
  const { error: updateError } = await supabaseClient
    .from('matches')
    .update({
      winner_id: winnerId,
      status: 'ended'
    })
    .eq('id', matchId);

  if (updateError) {
    console.error(updateError);
    return;
  }

  // 🔥 PROPAGA PARA PRÓXIMA PARTIDA
  if (match.next_match_id) {
    const { data: nextMatch } = await supabaseClient
      .from('matches')
      .select('*')
      .eq('id', match.next_match_id)
      .single();

    if (nextMatch) {
      const campo =
        nextMatch.team_a_id === null ? 'team_a_id' : 'team_b_id';

      await supabaseClient
        .from('matches')
        .update({ [campo]: winnerId })
        .eq('id', match.next_match_id);
    }
  }

  alert("Resultado atualizado!");
  location.reload();
}