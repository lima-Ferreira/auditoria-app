const API = "https://auditoria-api-jbhr.onrender.com/api";

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatarData(data) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

// Lógica de cores para os Badges
function getBadgeClass(val) {
  if (!val) return "badge-default";
  const v = val.toString().toLowerCase();
  const ruins = [
    "péssimo",
    "ruim",
    "não",
    "atrasado",
    "faltando",
    "sujo",
    "não ok",
  ];
  const bons = ["ótimo", "bom", "ok", "sim", "conforme", "limpo", "organizado"];

  if (ruins.some((word) => v.includes(word))) return "badge-red";
  if (bons.some((word) => v.includes(word))) return "badge-green";
  return "badge-default";
}

async function carregarAuditoria() {
  const id = getIdFromUrl();
  const container = document.getElementById("auditoria-detalhes");

  try {
    const res = await fetch(`${API}/auditorias/${id}`);
    if (!res.ok) throw new Error("Auditoria não encontrada.");
    const a = await res.json();
    renderizarAuditoria(a);
  } catch (err) {
    container.innerHTML = `<div class="error-card">⚠️ Erro: ${err.message}</div>`;
  }
}

function renderizarAuditoria(a) {
  const container = document.getElementById("auditoria-detalhes");
  const resFin =
    parseFloat(
      a.resultadoFinal?.toString().replace(".", "").replace(",", "."),
    ) || 0;
  const resColor = resFin < 0 ? "text-red" : "text-green";

  container.innerHTML = `
    <style>
        .audit-view { font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 900px; margin: auto; color: #1e293b; }
        
        /* Cabeçalho Principal */
      // Procure a tag <style> dentro da função renderizarAuditoria e adicione:

.header-menu { 
    background: #1e3a8a; 
    color: white; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    width: 100%;
}
.header-content { 
    max-width: 1200px; 
    margin: 0 auto; 
    height: 70px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 0 20px; 
}
.brand { display: flex; align-items: center; gap: 12px; }
.logo-icon { font-size: 22px; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 10px; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; text-align: left; }
.brand-text strong { font-size: 16px; letter-spacing: 1px; color: white; }
.brand-text small { font-size: 9px; opacity: 0.7; font-weight: bold; text-transform: uppercase; color: white; }

nav { display: flex; gap: 10px; }
.nav-link { 
    color: rgba(255,255,255,0.8); 
    text-decoration: none; 
    padding: 8px 12px; 
    border-radius: 8px; 
    font-size: 13px; 
    font-weight: 600; 
}
.nav-link:hover { background: rgba(255,255,255,0.1); color: white; }


        /* Estrutura de Cards Separados */
        .info-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .card-title { font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
        
        /* Grid para alinhar label e valor */
        .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; }
        .data-item { display: flex; flex-direction: column; gap: 4px; }
        .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .value { font-size: 15px; font-weight: 600; color: #0f172a; }

        /* Badges de Status */
        .badge { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; width: fit-content; }
        .badge-red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-default { background: #f1f5f9; color: #475569; }

        /* Financeiro Banner */
        .finance-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .text-green { color: #15803d !important; }
        .text-red { color: #b91c1c !important; }
        .big-number { font-size: 22px; font-weight: 900; }

        .conclusao-text { background: #fffbeb; border-left: 5px solid #f59e0b; padding: 20px; border-radius: 4px; font-style: italic; color: #92400e; line-height: 1.6; }
    </style>

    <div class="audit-view">
        <div class="main-header">
            <div>
                <span>Relatório de Auditoria</span>
                <h1>${a.loja?.fantasia || "Unidade Física"}</h1>
            </div>
            <div style="text-align: right">
                <span>Data Realizada</span>
                <strong>${formatarData(a.data)}</strong>
            </div>
        </div>

        <div class="info-card">
            <div class="card-title">👤 Equipe Responsável</div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Auditor</span>
                    <span class="value">${a.auditor?.nome || a.auditor || "—"}</span>
                </div>
                <div class="data-item">
                    <span class="label">Gerente da Loja</span>
                    <span class="value">${a.gerente?.nome || "—"}</span>
                </div>
            </div>
        </div>

        <div class="info-card" style="border-left: 5px solid #64748b;">
            <div class="card-title">📑 Protocolos de Acerto</div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Nº Acerto de Saída</span>
                    <span class="value"># ${a.acertoSaida || "0"}</span>
                </div>
                <div class="data-item">
                    <span class="label">Nº Acerto de Entrada</span>
                    <span class="value"># ${a.acertoEntrada || "0"}</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="card-title">📋 Avaliações de Infraestrutura</div>
            <div class="data-grid">
                <div class="data-item"><span class="label">Organização Loja</span><span class="badge ${getBadgeClass(a.organizacaoLoja)}">${a.organizacaoLoja}</span></div>
                <div class="data-item"><span class="label">Org. Depósito</span><span class="badge ${getBadgeClass(a.organizacaoDeposito)}">${a.organizacaoDeposito}</span></div>
                <div class="data-item"><span class="label">Limpeza Geral</span><span class="badge ${getBadgeClass(a.limpeza)}">${a.limpeza}</span></div>
                <div class="data-item"><span class="label">Fardamentos</span><span class="badge ${getBadgeClass(a.fardamentos)}">${a.fardamentos}</span></div>
                <div class="data-item"><span class="label">Vig. Sanitária</span><span class="badge ${getBadgeClass(a.vig_sanitaria)}">${a.vig_sanitaria}</span></div>
                <div class="data-item"><span class="label">Alvará</span><span class="badge ${getBadgeClass(a.alvara)}">${a.alvara}</span></div>
                <div class="data-item"><span class="label">Bombeiros</span><span class="badge ${getBadgeClass(a.bombeiros)}">${a.bombeiros}</span></div>
            </div>
            
            <div class="card-title" style="margin-top: 30px; border: none;">💰 Conferência de Caixas</div>
            <div class="data-grid">
                <div class="data-item"><span class="label">Caixa 01</span><span class="badge ${getBadgeClass(a.caixa_1)}">${a.caixa_1}</span></div>
                <div class="data-item"><span class="label">Caixa 02</span><span class="badge ${getBadgeClass(a.caixa_2)}">${a.caixa_2}</span></div>
                <div class="data-item"><span class="label">Caixa 03</span><span class="badge ${getBadgeClass(a.caixa_3)}">${a.caixa_3}</span></div>
            </div>
        </div>

                <!-- PRODUTOS RELEVANTES (NOVO BLOCO) -->
        ${
          a.produtosRelevantes && a.produtosRelevantes.length > 0
            ? `
        <div class="info-card" style="border-left: 5px solid #ef4444;">
            <div class="card-title" style="color: #b91c1c;">⚠️ Itens com Divergência Crítica</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                ${a.produtosRelevantes
                  .map(
                    (p) => `
                    <div style="background: #fef2f2; padding: 12px; border-radius: 8px; border: 1px dashed #fecaca; font-size: 14px; color: #991b1b; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 18px;">📦</span>
                        <strong>${p}</strong>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        `
            : `
        <div class="info-card">
            <div class="card-title">📦 Itens com Divergência</div>
            <div style="color: #94a3b8; font-style: italic; font-size: 13px;">Nenhum produto relevante registrado nesta auditoria.</div>
        </div>
        `
        }


        <div class="info-card">
            <div class="card-title">📈 Resultado Financeiro</div>
            <div class="finance-row">
            <div class="data-item"><span class="label">Total Faltas</span><span class="big-number text-red">R$ ${a.faltas}</span></div>
                <div class="data-item"><span class="label">Total Sobras</span><span class="big-number text-green">R$ ${a.sobras}</span></div>
                <div class="data-item"><span class="label">Saldo Final</span><span class="big-number ${resColor}">R$ ${a.resultadoFinal}</span></div>
            </div>
        </div>
        

        <div class="info-card">
            <div class="card-title">📝 Considerações Finais</div>
            <div class="conclusao-text">${a.conclusao || "Nenhuma observação registrada."}</div>
        </div>
        
        <button onclick="voltar()" style="width:100%; padding:15px; background:#1e3a8a; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-bottom:40px;">
            VOLTAR AO DASHBOARD
        </button>
    </div>
    `;
}

function voltar() {
  window.history.back();
}
document.addEventListener("DOMContentLoaded", carregarAuditoria);
