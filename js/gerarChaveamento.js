// gerarChaveamento.js

async function gerarChaveamento() {
  const btn = document.getElementById("btnGerar");

  btn.disabled = true;
  btn.innerText = "Gerando...";

  const { error } = await supabaseClient.rpc('gerar_chaveamento');

  if (error) {
    console.error("❌ Erro:", error.message);
    alert("Erro ao gerar chaveamento");
    btn.disabled = false;
    btn.innerText = "Gerar Chaveamento";
    return;
  }

  alert("✅ Chaveamento gerado!");
  btn.innerText = "Gerado!";
  
  setTimeout(() => {
    btn.disabled = false;
    btn.innerText = "Gerar Chaveamento";
    location.reload();
  }, 1500);
}