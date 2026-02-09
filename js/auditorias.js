const API = "https://auditoria-api-jbhr.onrender.com";
let todasAuditorias = []; // Variável global para armazenar os dados e permitir busca rápida

async function carregarAuditorias() {
  try {
    const res = await fetch(`${API}/auditorias`);
    todasAuditorias = await res.json();

    console.log("AUDITORIAS CARREGADAS:", todasAuditorias);
    renderizarTabela(todasAuditorias);
  } catch (err) {
    console.error("Erro ao carregar auditorias", err);
    document.getElementById("lista-auditorias").innerHTML =
      `<tr><td colspan="6" style="text-align:center; padding:50px; color:red;">⚠️ Erro ao conectar com o servidor.</td></tr>`;
  }
}

// Função para desenhar a tabela na tela
function renderizarTabela(lista) {
  const tbody = document.getElementById("lista-auditorias");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;">Nenhuma auditoria encontrada.</td></tr>`;
    return;
  }

  lista.forEach((a) => {
    const tr = document.createElement("tr");

    // Lógica para cor do Resultado (Verde para Positivo, Vermelho para Negativo)
    // Remove pontos e troca vírgula por ponto para converter em número real
    const valorNumerico =
      parseFloat(
        a.resultadoFinal?.toString().replace(/\./g, "").replace(",", "."),
      ) || 0;
    const badgeClass = valorNumerico < 0 ? "res-neg" : "res-pos";

    tr.innerHTML = `
        <td style="font-weight: 700; color: #1e3a8a;">${formatarData(a.data)}</td>
        <td>
            <div style="font-weight: 600;">${a.loja?.fantasia || "—"}</div>
            <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">${a.loja?.cidade || ""}</div>
        </td>
        <td>${a.gerente?.nome || a.gerente || "—"}</td>
        <td>${a.auditor?.nome || a.auditor || "—"}</td>
        <td>
            <span class="res-badge ${badgeClass}">
                R$ ${a.resultadoFinal || "0,00"}
            </span>
        </td>
        <td>
      
<div class="action-buttons">
    <a href="ver_auditoria.html?id=${a._id}" class="btn-icon btn-view" title="Ver">👁️</a>
   <a href="${API.replace("/api", "")}/pdf/${a._id}" target="_blank" class="btn-icon btn-pdf" title="Gerar PDF">
    📄
</a>
    <button onclick="deletarAuditoria('${a._id}')" class="btn-delete" title="Excluir">🗑️</button>
</div>


        </td>
    `;

    tbody.appendChild(tr);
  });
}

async function deletarAuditoria(id) {
  // 1. Defina sua senha aqui (depois você pode levar isso para o .env no backend)
  const SENHA_ADMIN = "lima112807";

  const tentativa = prompt(
    "🔐 AÇÃO RESTRITA\nDigite a senha de administrador para EXCLUIR esta auditoria:",
  );

  if (tentativa === null) return; // Usuário cancelou

  if (tentativa !== SENHA_ADMIN) {
    alert("❌ Senha incorreta! A exclusão foi bloqueada.");
    return;
  }

  if (
    confirm(
      "⚠️ ATENÇÃO!\nVocê está prestes a apagar permanentemente este registro do banco de dados.\n\nConfirma a exclusão?",
    )
  ) {
    try {
      const res = await fetch(`${API}/auditorias/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Auditoria removida com sucesso!");
        carregarAuditorias(); // Recarrega a tabela automaticamente
      } else {
        alert("Erro ao excluir no servidor. Verifique a rota DELETE.");
      }
    } catch (err) {
      console.error("Erro na exclusão:", err);
      alert("Erro de conexão com o banco de dados.");
    }
  }
}

// 🔍 FUNÇÃO DE BUSCA EM TEMPO REAL
function filtrarTabela() {
  const termo = document.getElementById("filtro-busca").value.toLowerCase();

  const filtrados = todasAuditorias.filter((a) => {
    const nomeLoja = (a.loja?.fantasia || "").toLowerCase();
    const nomeGerente = (a.gerente?.nome || a.gerente || "").toLowerCase();
    const nomeAuditor = (a.auditor?.nome || a.auditor || "").toLowerCase();
    const dataAud = formatarData(a.data).toLowerCase();

    return (
      nomeLoja.includes(termo) ||
      nomeGerente.includes(termo) ||
      nomeAuditor.includes(termo) ||
      dataAud.includes(termo)
    );
  });

  renderizarTabela(filtrados);
}

function formatarData(data) {
  if (!data) return "";
  // Ajuste para evitar que a data fique um dia atrás devido ao fuso horário
  const d = new Date(data);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString("pt-BR");
}

function verAuditoria(id) {
  window.location.href = `ver_auditoria.html?id=${id}`;
}

// Inicia o carregamento
document.addEventListener("DOMContentLoaded", carregarAuditorias);
