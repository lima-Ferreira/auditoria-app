// 1. URL da API (Sempre termina com /api para os dados)
const API = "https://auditoria-api-jbhr.onrender.com";

let todasAuditorias = [];

async function carregarAuditorias() {
  try {
    // Busca dados usando a rota /api/auditorias
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

function renderizarTabela(lista) {
  const tbody = document.getElementById("lista-auditorias");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;">Nenhuma auditoria encontrada.</td></tr>`;
    return;
  }

  lista.forEach((a) => {
    // GERA O LINK DO PDF LIMPANDO O /api (Apenas para o PDF)
    const linkPdf = `${API.replace("/api", "")}/pdf/${a._id}`;

    const valorNumerico =
      parseFloat(
        a.resultadoFinal?.toString().replace(/\./g, "").replace(",", "."),
      ) || 0;
    const badgeClass = valorNumerico < 0 ? "res-neg" : "res-pos";

    const tr = document.createElement("tr");
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
                
                <!-- LINK DO PDF CORRIGIDO -->
                <a href="${linkPdf}" target="_blank" class="btn-icon btn-pdf" title="Gerar PDF">📄</a>
                
                <button onclick="deletarAuditoria('${a._id}')" class="btn-delete" title="Excluir">🗑️</button>
            </div>
        </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deletarAuditoria(id) {
  const SENHA_ADMIN = "lima112807";
  const tentativa = prompt(
    "🔐 AÇÃO RESTRITA\nDigite a senha de administrador para EXCLUIR:",
  );

  if (tentativa === null) return;
  if (tentativa !== SENHA_ADMIN) {
    alert("❌ Senha incorreta!");
    return;
  }

  if (confirm("⚠️ Confirma a exclusão permanente?")) {
    try {
      // Exclui usando a rota /api/auditorias/id
      const res = await fetch(`${API}/auditorias/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Excluída!");
        carregarAuditorias();
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  }
}

function filtrarTabela() {
  const termo = document.getElementById("filtro-busca").value.toLowerCase();
  const filtrados = todasAuditorias.filter((a) => {
    const nomeLoja = (a.loja?.fantasia || "").toLowerCase();
    const nomeGerente = (a.gerente?.nome || a.gerente || "").toLowerCase();
    const nomeAuditor = (a.auditor?.nome || a.auditor || "").toLowerCase();
    return (
      nomeLoja.includes(termo) ||
      nomeGerente.includes(termo) ||
      nomeAuditor.includes(termo)
    );
  });
  renderizarTabela(filtrados);
}

function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString("pt-BR");
}

document.addEventListener("DOMContentLoaded", carregarAuditorias);
