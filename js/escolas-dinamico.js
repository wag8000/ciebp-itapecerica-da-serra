/* =========================================================
   ESCOLAS-DINAMICO.JS - Página Escolas Participantes | CIEBP
   Responsabilidades:
   - Montar o índice de escolas a partir dos cards do HTML.
   - Corrigir metadados visuais de numeração.
   - Manter Alexandre como prioritária sem impedir outros destaques.
   - Ajustar rolagem com header fixo.
   - Ativar busca, fallback de imagens, animação e botão voltar ao topo.
========================================================= */

(() => {
  const quickLinks = document.querySelector("#schoolsQuickLinks");
  const searchInput = document.querySelector("#schoolSearch");
  const cards = Array.from(document.querySelectorAll("[data-school-card]"));
  const featuredId = "alexandre-rodrigues-nogueira";

  const canonicalSchools = [
    ["alexandre-rodrigues-nogueira", "01", "Alexandre Rodrigues Nogueira"],
    ["andre-franco-montoro", "02", "André Franco Montoro"],
    ["bairro-boa-vista", "03", "Bairro Boa Vista"],
    ["bairro-da-palmeirinha", "04", "Bairro da Palmeirinha"],
    ["benevides-beraldo-comendador", "05", "Benevides Beraldo – Comendador"],
    ["carlos-alberto-pereira", "06", "Carlos Alberto Pereira"],
    ["eduardo-roberto-daher", "07", "Eduardo Roberto Daher"],
    ["jardim-do-carmo", "08", "Jardim do Carmo"],
    ["joao-ortiz-rodrigues", "09", "João Ortiz Rodrigues"],
    ["joaquim-fernando-paes-de-barros-neto", "10", "Joaquim Fernando Paes de Barros Neto"],
    ["levi-pereira-martins-professor", "11", "Levi Pereira Martins – Professor"],
    ["matilde-maria-cremm", "12", "Matilde Maria Cremm"],
    ["natercia-cremm-de-moraes-pedro-professora", "13", "Natércia Cremm de Moraes Pedro – Professora"],
    ["neide-celestina-de-oliveira", "14", "Neide Celestina de Oliveira"],
    ["oredo-rodrigues-da-cruz", "15", "Oredo Rodrigues da Cruz"],
    ["paulo-de-castro-ferreira-junior-jornalista", "16", "Paulo de Castro Ferreira Junior – Jornalista"],
    ["jardim-pedra-branca", "17", "Jardim Pedra Branca"],
    ["salvador-de-leone", "18", "Salvador de Leone"],
    ["sophia-maria-januaria-amaral", "19", "Sophia Maria Januária Amaral"]
  ];

  const canonicalMap = new Map(canonicalSchools.map(([id, number, name]) => [id, { number, name }]));

  const normalize = (value = "") =>
    value
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const parseNumber = (value) => {
    const number = Number.parseInt(value, 10);
    return Number.isNaN(number) ? 999 : number;
  };

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getHeaderOffset = () => {
    const header = document.querySelector("header, .schools-header");
    const height = header ? header.getBoundingClientRect().height : 92;
    return Math.ceil(height + 28);
  };

  const getOrderedCards = () =>
    [...cards].sort((a, b) => parseNumber(a.dataset.schoolNumber) - parseNumber(b.dataset.schoolNumber));

  function normalizeCards() {
    cards.forEach((card) => {
      const canonical = canonicalMap.get(card.id);
      const isFeatured = card.id === featuredId;

      if (canonical) {
        card.dataset.schoolNumber = canonical.number;
        card.dataset.schoolName = canonical.name;

        const title = card.querySelector(".school-card__title");
        const eyebrow = card.querySelector(".school-card__eyebrow");

        if (title) title.textContent = canonical.name;
        if (eyebrow) eyebrow.textContent = `Escola participante - ${canonical.number}`;
      }

      card.classList.toggle("school-card--featured", isFeatured);
      card.dataset.schoolPriority = isFeatured ? "true" : "false";

      prepareImageFallback(card);
    });
  }

  function prepareImageFallback(card) {
    const media = card.querySelector(".school-card__media");
    const image = card.querySelector(".school-card__image");

    if (!media) return;

    if (!media.querySelector(".school-card__image-fallback")) {
      const fallback = document.createElement("div");
      fallback.className = "school-card__image-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.innerHTML = `
        <span>🤖</span>
        <strong>Imagem em atualização</strong>
        <small>A equipe poderá inserir a foto oficial neste espaço.</small>
      `;
      media.appendChild(fallback);
    }

    if (!image) {
      card.classList.add("school-card--image-missing");
      return;
    }

    const src = image.getAttribute("src")?.trim() || "";
    const incompletePath = src === "" || src.endsWith("/imagem/equipes/") || src.endsWith("/imagem/escolas/");

    if (incompletePath) card.classList.add("school-card--image-missing");

    image.addEventListener("error", () => card.classList.add("school-card--image-missing"));
    image.addEventListener("load", () => {
      if (!incompletePath) card.classList.remove("school-card--image-missing");
    });
  }

  function buildQuickLinks() {
    if (!quickLinks) return;

    quickLinks.innerHTML = "";

    getOrderedCards().forEach((card) => {
      const number = String(card.dataset.schoolNumber || "").padStart(2, "0");
      const name = card.dataset.schoolName || card.querySelector(".school-card__title")?.textContent || "Escola";

      const link = document.createElement("a");
      link.href = `#${card.id}`;
      link.className = "schools-index__link";
      link.dataset.schoolLink = card.id;
      link.innerHTML = `<span>${number}</span><strong>${name}</strong>`;

      if (card.id === featuredId) link.classList.add("is-priority");

      link.addEventListener("click", (event) => {
        event.preventDefault();
        activateSchool(card.id);
        scrollToSchool(card.id);
        history.pushState(null, "", `#${card.id}`);
      });

      quickLinks.appendChild(link);
    });
  }

  function activateSchool(cardId) {
    const validId = cards.some((card) => card.id === cardId) ? cardId : featuredId;

    document.querySelectorAll("[data-school-link]").forEach((link) => {
      const isActive = link.dataset.schoolLink === validId;
      link.classList.toggle("is-active", isActive);

      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    cards.forEach((card) => {
      card.classList.toggle("is-target", card.id === validId);
    });
  }

  function scrollToSchool(cardId, behavior = prefersReducedMotion() ? "auto" : "smooth") {
    const card = document.getElementById(cardId);
    if (!card) return;

    const top = card.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top: Math.max(top, 0),
      behavior
    });
  }

  function filterSchools() {
    const term = normalize(searchInput?.value || "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalize([
        card.dataset.schoolNumber,
        card.dataset.schoolName,
        card.textContent
      ].join(" "));

      const isVisible = !term || haystack.includes(term);
      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    document.querySelectorAll("[data-school-link]").forEach((link) => {
      const card = document.getElementById(link.dataset.schoolLink);
      link.hidden = card?.classList.contains("is-hidden") || false;
    });

    updateResultsStatus(visibleCount, term);
    updateEmptyState(visibleCount, term);
  }

  function createResultsStatus() {
    if (!quickLinks || document.querySelector(".schools-results-status")) return;

    const status = document.createElement("p");
    status.className = "schools-results-status";
    status.setAttribute("aria-live", "polite");
    quickLinks.insertAdjacentElement("afterend", status);
  }

  function updateResultsStatus(count = cards.length, term = "") {
    const status = document.querySelector(".schools-results-status");
    if (!status) return;

    const total = cards.length;
    status.innerHTML = term
      ? `<strong>${count}</strong> de <strong>${total}</strong> escolas encontradas.`
      : `<strong>${total}</strong> escolas participantes cadastradas.`;
  }

  function createEmptyState() {
    const list = document.querySelector(".schools-list");
    if (!list || document.querySelector(".schools-empty-state")) return;

    const empty = document.createElement("div");
    empty.className = "schools-empty-state";
    empty.textContent = "Nenhuma escola encontrada para essa busca.";
    list.prepend(empty);
  }

  function updateEmptyState(count, term) {
    const empty = document.querySelector(".schools-empty-state");
    if (!empty) return;
    empty.classList.toggle("is-visible", Boolean(term) && count === 0);
  }

  function animateCards() {
    if (prefersReducedMotion()) {
      cards.forEach((card) => (card.dataset.animate = "show"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => (card.dataset.animate = "show"));
      return;
    }

    cards.forEach((card) => (card.dataset.animate = "ready"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.animate = "show";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  function observeActiveCard() {
    if (!("IntersectionObserver" in window)) return;

    let lastActiveId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && !entry.target.classList.contains("is-hidden"))
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id && visible.target.id !== lastActiveId) {
          lastActiveId = visible.target.id;
          activateSchool(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: `-${getHeaderOffset()}px 0px -55% 0px`,
        threshold: [0.18, 0.35, 0.55]
      }
    );

    cards.forEach((card) => observer.observe(card));
  }

  function createBackToTop() {
    if (document.querySelector(".back-to-top")) return;

    const button = document.createElement("button");
    button.className = "back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "Voltar ao topo");
    button.textContent = "↑";

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });

    document.body.appendChild(button);

    window.addEventListener(
      "scroll",
      () => {
        button.classList.toggle("is-visible", window.scrollY > 520);
      },
      { passive: true }
    );
  }

  function applyInitialState() {
    const hashId = decodeURIComponent(location.hash.replace("#", ""));
    const initialId = hashId && document.getElementById(hashId) ? hashId : featuredId;

    activateSchool(initialId);

    if (hashId && document.getElementById(hashId)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToSchool(hashId, "auto"));
      });
    }
  }

  function bindEvents() {
    if (searchInput) searchInput.addEventListener("input", filterSchools);

    window.addEventListener("hashchange", () => {
      const hashId = decodeURIComponent(location.hash.replace("#", ""));
      if (!hashId || !document.getElementById(hashId)) return;
      activateSchool(hashId);
      scrollToSchool(hashId);
    });
  }

  function init() {
    if (!quickLinks || cards.length === 0) return;

    normalizeCards();
    buildQuickLinks();
    createResultsStatus();
    createEmptyState();
    filterSchools();
    animateCards();
    applyInitialState();
    observeActiveCard();
    createBackToTop();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
