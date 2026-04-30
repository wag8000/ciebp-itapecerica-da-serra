// cadastrarTime.js

async function cadastrarTime(escola, nome) {
  const { data, error } = await supabaseClient
    .from('teams')
    .insert([{ escola, nome }])
    .select();

  if (error) {
    console.error("❌ Erro ao cadastrar:", error.message);
    alert("Erro ao cadastrar time");
    return;
  }

  console.log("✅ Time cadastrado:", data);
  alert("Time cadastrado com sucesso!");
}