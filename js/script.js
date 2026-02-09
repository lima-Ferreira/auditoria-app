// 1. Link padrão para buscar dados (COM /api)
const API = "https://auditoria-api-jbhr.onrender.com";

// 2. Na função que desenha a tabela, crie o link do PDF SEM o /api
const linkPdf = `${API.replace("/api", "")}/pdf/${a._id}`;

// --- 1. INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se está na página de CADASTROS
  if (document.getElementById("lista-lojas")) {
    carregarListasCadastros();
  }

  // Verifica se está na página de NOVA AUDITORIA
  if (document.getElementById("form-auditoria")) {
    carregarSelectsAuditoria();
    configurarLogicaProdutos();
    configurarCalculoFinanceiro(); // Agora ela existe abaixo
  }
});

// --- 2. UTILITÁRIOS (Formatação) ---
function formatarMoeda(valor) {
  const num =
    typeof valor === "string"
      ? parseFloat(valor.replace(/\./g, "").replace(",", "."))
      : valor;
  return (num || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// --- 3. LÓGICA DE NOVA AUDITORIA ---
function configurarCalculoFinanceiro() {
  const inputSobras = document.getElementById("aud-sobras");
  const inputFaltas = document.getElementById("aud-faltas");
  const inputFinal = document.getElementById("aud-final");

  const processarECalcular = () => {
    // 1. Captura os valores e limpa para o JS entender
    let sVal = inputSobras.value.replace(/\./g, "").replace(",", ".") || "0";
    let fVal = inputFaltas.value.replace(/\./g, "").replace(",", ".") || "0";

    const s = parseFloat(sVal);
    const f = parseFloat(fVal);

    // 2. Formata os inputs de entrada para ficarem bonitos (R$ 1.250,00)
    inputSobras.value = s.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    inputFaltas.value = f.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

    // 3. Lógica do Resultado:
    // Se Falta é maior que Sobra, mostramos o valor positivo (Dívida/Prejuízo)
    // Se Sobra é maior que Falta, mostramos com o sinal de "-"
    const resultado = f - s;

    // 4. Exibe o resultado formatado
    inputFinal.value = resultado.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Estilo visual rápido: Vermelho se for prejuízo (Falta > Sobra)
    inputFinal.style.color = f > s ? "#dc2626" : "#16a34a";
  };

  // 'blur' dispara quando o usuário clica fora do campo (terminou de digitar)
  inputSobras.addEventListener("blur", processarECalcular);
  inputFaltas.addEventListener("blur", processarECalcular);
}

// Preenche os selects buscando no MongoDB
async function carregarSelectsAuditoria() {
  try {
    const [resLojas, resGerentes, resAuditores] = await Promise.all([
      fetch(`${linkPdf}/lojas`),
      fetch(`${linkPdf}/gerentes`),
      fetch(`${linkPdf}/auditores`),
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

  btnAdd.addEventListener("click", () => {
    if (inputProd.value.trim()) {
      listaProds.push(inputProd.value.trim());
      areaLista.value = listaProds.map((p, i) => `${i + 1}. ${p}`).join("\n");
      inputProd.value = "";
    }
  });
}

// SALVAR AUDITORIA
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
      const res = await fetch(`${linkPdf}/auditorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditoria),
      });
      if (res.ok) {
        alert("✅ Auditoria salva!");
        window.location.href = "auditorias.html";
      }
    } catch (err) {
      console.error(err);
    }
  });

// --- 4. LÓGICA DE CADASTROS (Igual antes, mas sem erros) ---
async function carregarListasCadastros() {
  try {
    const [resLojas, resGerentes, resAuditores] = await Promise.all([
      fetch(`${linkPdf}/lojas`),
      fetch(`${linkPdf}/gerentes`),
      fetch(`${linkPdf}/auditores`),
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
