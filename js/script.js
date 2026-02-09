// 1. Link oficial da API (COM /api para todos os dados)
const API = "https://auditoria-api-jbhr.onrender.com";

// --- 1. INICIALIZAÇÃO INTELIGENTE ---
document.addEventListener("DOMContentLoaded", () => {
  // Se estiver na página de CADASTROS
  if (document.getElementById("lista-lojas")) {
    carregarListas();
  }

  // Se estiver na página de NOVA AUDITORIA
  if (document.getElementById("form-auditoria")) {
    carregarSelectsAuditoria();
    configurarLogicaProdutos();
    configurarCalculoFinanceiro();
  }
});

// --- 2. FUNÇÕES DE CADASTRO (Página de Cadastros) ---

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

    if (document.getElementById("lista-lojas"))
      document.getElementById("lista-lojas").innerHTML = lojas
        .map((l) => `<li>${l.fantasia}</li>`)
        .join("");
    if (document.getElementById("lista-gerentes"))
      document.getElementById("lista-gerentes").innerHTML = gerentes
        .map((g) => `<li>${g.nome}</li>`)
        .join("");
    if (document.getElementById("lista-auditores"))
      document.getElementById("lista-auditores").innerHTML = auditores
        .map((a) => `<li>${a.nome}</li>`)
        .join("");
  } catch (err) {
    console.error("Erro ao carregar listas:", err);
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
  // USAMOS A ROTA /api/lojas
  await fetch(`${API}/lojas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  location.reload();
}

async function cadastrarGerente() {
  const nome = document.getElementById("cad-gerente").value;
  await fetch(`${API}/gerentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

async function cadastrarAuditor() {
  const nome = document.getElementById("cad-auditor").value;
  await fetch(`${API}/auditores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  location.reload();
}

// --- 3. LÓGICA DE NOVA AUDITORIA (Página de Nova Auditoria) ---

async function carregarSelectsAuditoria() {
  try {
    const [resLojas, resGerentes, resAuditores] = await Promise.all([
      fetch(`${API}/lojas`),
      fetch(`${API}/gerentes`),
      fetch(`${API}/auditores`),
    ]);
    const lojas = await resLojas.json();
    const gerentes = await resGerentes.json();
    const auditores = await resAuditores.json();

    document.getElementById("aud-loja").innerHTML =
      `<option value="">Selecione...</option>` +
      lojas
        .map((l) => `<option value="${l._id}">${l.fantasia}</option>`)
        .join("");
    document.getElementById("aud-gerente").innerHTML =
      `<option value="">Selecione...</option>` +
      gerentes
        .map((g) => `<option value="${g._id}">${g.nome}</option>`)
        .join("");
    document.getElementById("aud-auditor").innerHTML =
      `<option value="">Selecione...</option>` +
      auditores
        .map((a) => `<option value="${a._id}">${a.nome}</option>`)
        .join("");
  } catch (err) {
    console.error(err);
  }
}

function configurarLogicaProdutos() {
  const btnAdd = document.getElementById("btn-add-produto");
  const inputProd = document.getElementById("produto-input");
  const areaLista = document.getElementById("aud-produtos");
  let listaProds = [];

  btnAdd?.addEventListener("click", () => {
    if (inputProd.value.trim()) {
      listaProds.push(inputProd.value.trim());
      areaLista.value = listaProds.map((p, i) => `${i + 1}. ${p}`).join("\n");
      inputProd.value = "";
    }
  });
}

function configurarCalculoFinanceiro() {
  const inputSobras = document.getElementById("aud-sobras");
  const inputFaltas = document.getElementById("aud-faltas");
  const inputFinal = document.getElementById("aud-final");

  const calcular = () => {
    const s =
      parseFloat(inputSobras.value.replace(/\./g, "").replace(",", ".")) || 0;
    const f =
      parseFloat(inputFaltas.value.replace(/\./g, "").replace(",", ".")) || 0;
    const resultado = f - s; // Lógica que você pediu: Falta > Sobra = Positivo
    inputFinal.value = resultado.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
  };

  inputSobras?.addEventListener("blur", calcular);
  inputFaltas?.addEventListener("blur", calcular);
}

// ENVIAR FORMULÁRIO DE AUDITORIA
document
  .getElementById("form-auditoria")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const auditoria = {
      data: document.getElementById("aud-data").value,
      acertoSaida: document.getElementById("aud-acerto-saida").value,
      acertoEntrada: document.getElementById("aud-acerto-entrada").value,
      loja: document.getElementById("aud-loja").value,
      gerente: document.getElementById("aud-gerente").value,
      auditor: document.getElementById("aud-auditor").value,
      organizacaoLoja: document.getElementById("aud-org-loja").value,
      organizacaoDeposito: document.getElementById("aud-org-deposito").value,
      limpeza: document.getElementById("aud-limpeza").value,
      fardamentos: document.getElementById("aud-fardamentos").value,
      caixa_1: document.getElementById("aud-caixa-1").value,
      caixa_2: document.getElementById("aud-caixa-2").value,
      caixa_3: document.getElementById("aud-caixa-3").value,
      vig_sanitaria: document.getElementById("aud-vig-sanitaria").value,
      alvara: document.getElementById("aud-alvara").value,
      bombeiros: document.getElementById("aud-bombeiros").value,
      produtosRelevantes: document
        .getElementById("aud-produtos")
        .value.split("\n")
        .filter((line) => line !== ""),
      sobras: document.getElementById("aud-sobras").value,
      faltas: document.getElementById("aud-faltas").value,
      resultadoFinal: document.getElementById("aud-final").value,
      conclusao: document.getElementById("aud-conclusao").value,
    };

    try {
      const res = await fetch(`${API}/auditorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditoria),
      });
      if (res.ok) {
        alert("✅ Auditoria salva com sucesso!");
        window.location.href = "index.html";
      }
    } catch (err) {
      alert("Erro ao salvar.");
    }
  });
