const supabase = window.supabaseClient;

async function gerarChaveamento() {
  const btn = document.getElementById("btnGerar");

  btn.disabled = true;
  btn.innerText = "Gerando...";

  const { error } = await supabase.rpc('gerar_chaveamento');

  if (error) {
    console.error(error);
    alert("Erro ao gerar chaveamento");
    btn.disabled = false;
    btn.innerText = "Gerar Chaveamento";
    return;
  }

  alert("Chaveamento gerado!");
  location.reload();
}