const supabase = window.supabaseClient;

async function cadastrarTime(escola, nome_equipe) {
  const { error } = await supabase
    .from('teams')
    .insert([{ escola, nome_equipe }]);

  if (error) {
    console.error(error);
    alert("Erro ao cadastrar");
    return;
  }

  alert("Time cadastrado!");
}