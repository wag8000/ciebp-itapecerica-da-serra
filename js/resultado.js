const supabase = window.supabaseClient;

async function definirVencedor(matchId, lado) {
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  const winnerId = lado === 'A'
    ? match.team_a_id
    : match.team_b_id;

  await supabase
    .from('matches')
    .update({
      winner_id: winnerId,
      status: 'ended'
    })
    .eq('id', matchId);

  if (match.next_match_id) {
    const { data: next } = await supabase
      .from('matches')
      .select('*')
      .eq('id', match.next_match_id)
      .single();

    const campo = next.team_a_id === null
      ? 'team_a_id'
      : 'team_b_id';

    await supabase
      .from('matches')
      .update({ [campo]: winnerId })
      .eq('id', match.next_match_id);
  }

  location.reload();
}