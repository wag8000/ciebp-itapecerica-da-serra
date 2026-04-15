/* ============================================================
   CIEBP – Landing Page · JavaScript (Full Stack Refactored)
   Tabela dinâmica integrada com API Node.js + MySQL
   ============================================================ */

let DATA = [];

const PAGE_SIZE = 5;
let state = {
  filter: "Todos",
  query: "",
  sortCol: null,
  sortDir: "asc",
  page: 1,
  editId: null,
};

/* ── Funções de API (Conexão com Node.js) ───────────────────── */
async function loadIniciativas() {
    try {
        const response = await fetch('http://localhost:3000/api/iniciativas');
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        DATA = await response.json();
        renderTable();
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

/* ── Helpers ─────────────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return "—";
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return d;
  return dateObj.toLocaleDateString('pt-BR');
};

const statusClass = {
  Ativo:      "badge-ativo",
  "Em Pausa": "badge-pausa",
  Concluído:  "badge-concluido",
  Planejado:  "badge-planejado",
};

const prioClass = {
  Alta:  "prio-alta",
  Média: "prio-media",
  Baixa: "prio-baixa",
};

const hexLighten = (hex) => hex + "22";

/* ── Core render ─────────────────────────────────────────────── */
function getFiltered() {
  let rows = [...DATA];

  if (state.filter !== "Todos") {
    rows = rows.filter((r) => r.status === state.filter);
  }

  if (state.query.trim()) {
    const q = state.query.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.titulo.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q)
    );
  }

  if (state.sortCol) {
    rows.sort((a, b) => {
      let va = a[state.sortCol];
      let vb = b[state.sortCol];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return state.sortDir === "asc" ? -1 : 1;
      if (va > vb) return state.sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  return rows;
}

function renderTable() {
  const rows = getFiltered();
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const paged = rows.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
  const tbody = document.getElementById("table-body");
  const countEl = document.getElementById("row-count");
  
  if (countEl) {
    countEl.textContent = `${rows.length} iniciativa${rows.length !== 1 ? "s" : ""} encontrada${rows.length !== 1 ? "s" : ""}`;
  }

  if (paged.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <p>Nenhuma iniciativa encontrada.</p>
        </div>
      </td></tr>`;
  } else {
    tbody.innerHTML = paged.map((r) => rowHtml(r)).join("");
  }

  renderPagination(totalPages);
  updateSortHeaders();
  attachRowActions();
}

function rowHtml(r) {
  const barClass = r.progresso === 100 ? "progress-bar full" : "progress-bar";
  const cor = r.categoria_cor || "#1B1464"; 
  
  return `
    <tr data-id="${r.id}">
      <td class="td-title">
        ${r.titulo}
        <small>${r.descricao || ''}</small>
      </td>
      <td>
        <span class="cat-pill"
          style="background:${hexLighten(cor)};color:${cor}">
          ${r.categoria}
        </span>
      </td>
      <td>${r.responsavel}</td>
      <td><span class="badge ${statusClass[r.status]}">${r.status}</span></td>
      <td><span class="prio ${prioClass[r.prioridade]}">${r.prioridade}</span></td>
      <td>${fmtDate(r.data_fim)}</td>
      <td>
        <div class="progress-wrap">
          <div class="progress-meta">
            <span>${r.progresso}%</span>
          </div>
          <div class="progress-track">
            <div class="${barClass}" style="width:${r.progresso}%"></div>
          </div>
        </div>
      </td>
      <td>
        <button class="btn-icon edit-btn" data-id="${r.id}" title="Editar">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 0 1 2.828 2.828L11.828 15.828A2 2 0 0 1 10.414 16H8v-2.414a2 2 0 0 1 .586-1.414z"/>
          </svg>
        </button>
        <button class="btn-icon delete-btn" data-id="${r.id}" title="Excluir">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
          </svg>
        </button>
      </td>
    </tr>`;
}

function renderPagination(totalPages) {
  const wrap = document.getElementById("pagination");
  if (!wrap) return;
  wrap.innerHTML = "";

  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.innerHTML = "‹";
  prev.disabled = state.page === 1;
  prev.onclick = () => { state.page--; renderTable(); };
  wrap.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === state.page ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => { state.page = i; renderTable(); };
    wrap.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "page-btn";
  next.innerHTML = "›";
  next.disabled = state.page === totalPages;
  next.onclick = () => { state.page++; renderTable(); };
  wrap.appendChild(next);
}

function updateSortHeaders() {
  document.querySelectorAll("thead th[data-col]").forEach((th) => {
    th.classList.remove("sorted-asc", "sorted-desc");
    if (th.dataset.col === state.sortCol) {
      th.classList.add(state.sortDir === "asc" ? "sorted-asc" : "sorted-desc");
    }
  });
}

function attachRowActions() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => openModal(parseInt(btn.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => deleteRow(parseInt(btn.dataset.id));
  });
}

// DELETE: Comunica a exclusão ao servidor
async function deleteRow(id) {
  if (!confirm("Deseja excluir esta iniciativa permanentemente?")) return;
  
  try {
      const response = await fetch(`http://localhost:3000/api/iniciativas/${id}`, {
          method: 'DELETE'
      });
      if (response.ok) {
          DATA = DATA.filter((r) => r.id !== id); // Remove localmente para não precisar recarregar tudo
          renderTable();
      } else {
          alert("Erro ao excluir do banco de dados.");
      }
  } catch (error) {
      alert("Falha na conexão com o servidor.");
  }
}

function openModal(id = null) {
  state.editId = id;
  const overlay = document.getElementById("modal-overlay");
  const title = document.getElementById("modal-title");

  if (id) {
    const row = DATA.find((r) => r.id === id);
    title.textContent = "Editar Iniciativa";
    document.getElementById("f-titulo").value      = row.titulo;
    document.getElementById("f-descricao").value   = row.descricao || "";
    document.getElementById("f-categoria").value   = row.categoria;
    document.getElementById("f-responsavel").value = row.responsavel || "";
    document.getElementById("f-status").value      = row.status;
    document.getElementById("f-prioridade").value  = row.prioridade;
    document.getElementById("f-progresso").value   = row.progresso;
    
    // Formata a data vinda do banco (ISO) para o input do tipo 'date'
    document.getElementById("f-data-inicio").value = row.data_inicio ? row.data_inicio.split('T')[0] : "";
    document.getElementById("f-data-fim").value    = row.data_fim ? row.data_fim.split('T')[0] : "";
  } else {
    title.textContent = "Nova Iniciativa";
    document.getElementById("modal-form").reset();
  }

  overlay.classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  state.editId = null;
}

// POST e PUT: Salva dados novos ou editados no banco
async function saveModal() {
  // Pega os valores e converte campos vazios em null para não quebrar o banco de dados
  const dataInicioVal = document.getElementById("f-data-inicio").value;
  const dataFimVal = document.getElementById("f-data-fim").value;

  const entry = {
    titulo:      document.getElementById("f-titulo").value.trim(),
    descricao:   document.getElementById("f-descricao").value.trim(),
    categoria:   document.getElementById("f-categoria").value,
    responsavel: document.getElementById("f-responsavel").value.trim(),
    status:      document.getElementById("f-status").value,
    prioridade:  document.getElementById("f-prioridade").value,
    progresso:   parseInt(document.getElementById("f-progresso").value) || 0,
    data_inicio: dataInicioVal ? dataInicioVal : null,
    data_fim:    dataFimVal ? dataFimVal : null,
  };

  if (!entry.titulo) { alert("O campo 'Título' é obrigatório."); return; }

  // Se tiver editId, atualiza (PUT). Se não, cria (POST)
  const method = state.editId ? 'PUT' : 'POST';
  const url = state.editId ? `http://localhost:3000/api/iniciativas/${state.editId}` : 'http://localhost:3000/api/iniciativas';

  try {
      const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
      });

      if (response.ok) {
          closeModal();
          await loadIniciativas(); // Recarrega os dados fresquinhos do banco
      } else {
          alert("Erro ao salvar os dados no servidor.");
      }
  } catch (error) {
      alert("Falha na conexão com o servidor.");
  }
}

/* ── Bootstrap ───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadIniciativas();

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.query = e.target.value;
        state.page = 1;
        renderTable();
      });
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filter = btn.dataset.filter;
      state.page = 1;
      renderTable();
    });
  });

  document.querySelectorAll("thead th[data-col]").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if (state.sortCol === col) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortCol = col;
        state.sortDir = "asc";
      }
      renderTable();
    });
  });

  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeModal();
      });
  }
});

/* Exposed to HTML */
window.openModal  = openModal;
window.closeModal = closeModal;
window.saveModal  = saveModal;