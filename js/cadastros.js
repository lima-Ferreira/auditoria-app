// 1. Link padrão para buscar dados (COM /api)
const API = "https://auditoria-api-jbhr.onrender.com";

// 2. Na função que desenha a tabela, crie o link do PDF SEM o /api
const linkPdf = `${API.replace("/api", "")}/pdf/${a._id}`;

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

    document.getElementById("lista-lojas").innerHTML = lojas
      .map((l) => `<li>${l.fantasia}</li>`)
      .join("");
    document.getElementById("lista-gerentes").innerHTML = gerentes
      .map((g) => `<li>${g.nome}</li>`)
      .join("");
    document.getElementById("lista-auditores").innerHTML = auditores
      .map((a) => `<li>${a.nome}</li>`)
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function cadastrarLojaCompleta() {
  const dados = {
    fantasia: document.getElementById("loja-fantasia").value,
    razao: document.getElementById("loja-razao").value,
    cnpj: document.getElementById("loja-cnpj").value,
    telefone: document.getElementById("loja-telefone").value,
    endereco: document.getElementById("loja-endereco").value,
    cidade: document.getElementById("loja-cidade").value,
  };
  await fetch(`${linkPdf}/lojas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  location.reload();
}

async function cadastrarGerente() {
  const nome = document.getElementById("cad-gerente").value;
  await fetch(`${linkPdf}/gerentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

async function cadastrarAuditor() {
  const nome = document.getElementById("cad-auditor").value;
  await fetch(`${linkPdf}/auditores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

document.addEventListener("DOMContentLoaded", carregarListas);
