// 1. Link oficial da API (COM /api para todos os dados)
const API = "https://auditoria-api-jbhr.onrender.com";

// --- 1. CARREGAR LISTAS AO INICIAR ---
async function carregarListas() {
  try {
    const [resLojas, resGerentes, resAuditores] = await Promise.all([
      fetch(`${API}/lojas`),
      fetch(`${API}/gerentes`),
      fetch(`${API}/auditores`),
    ]);

    const lojas = await resLojas.json();
    const gerentes = await resGerentes.json();
    const auditores = await resAuditores.json();

    // Preenche as listas se os elementos existirem na tela
    const elLojas = document.getElementById("lista-lojas");
    const elGerentes = document.getElementById("lista-gerentes");
    const elAuditores = document.getElementById("lista-auditores");

    if (elLojas)
      elLojas.innerHTML = lojas.map((l) => `<li>${l.fantasia}</li>`).join("");
    if (elGerentes)
      elGerentes.innerHTML = gerentes.map((g) => `<li>${g.nome}</li>`).join("");
    if (elAuditores)
      elAuditores.innerHTML = auditores
        .map((a) => `<li>${a.nome}</li>`)
        .join("");
  } catch (err) {
    console.error("Erro ao carregar listas:", err);
  }
}

// --- 2. FUNÇÕES DE CADASTRO ---

async function cadastrarLojaCompleta() {
  const dados = {
    fantasia: document.getElementById("loja-fantasia").value,
    razao: document.getElementById("loja-razao").value,
    cnpj: document.getElementById("loja-cnpj").value,
    telefone: document.getElementById("loja-telefone").value,
    endereco: document.getElementById("loja-endereco").value,
    cidade: document.getElementById("loja-cidade").value,
  };

  // USAMOS A ROTA /api/lojas (Correto)
  await fetch(`${API}/lojas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  location.reload();
}

async function cadastrarGerente() {
  const nome = document.getElementById("cad-gerente").value;
  if (!nome) return alert("Digite o nome!");

  await fetch(`${API}/gerentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

async function cadastrarAuditor() {
  const nome = document.getElementById("cad-auditor").value;
  if (!nome) return alert("Digite o nome!");

  await fetch(`${API}/auditores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

document.addEventListener("DOMContentLoaded", carregarListas);
