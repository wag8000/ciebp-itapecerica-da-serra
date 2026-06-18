(() => {
  "use strict";

  const CONFIG = {
    expectedSchoolCount: 19,
    cardSelector: "[data-school-card], .school-card[id]",
    quickLinksId: "schoolsQuickLinks",
    searchInputId: "schoolSearch",
    backToTopId: "backToTop",
    targetClass: "is-target",
    hiddenClass: "is-hidden",
    activeClass: "is-active",
    backToTopVisibleClass: "is-visible",
  };

  const REQUIRED_SCHOOLS = [
    {
      number: "01",
      name: "Alexandre Rodrigues Nogueira",
      id: "alexandre-rodrigues-nogueira",
    },
    {
      number: "02",
      name: "André Franco Montoro",
      id: "andre-franco-montoro",
    },
    {
      number: "03",
      name: "Bairro Boa Vista",
      id: "bairro-boa-vista",
    },
    {
      number: "04",
      name: "Bairro da Palmeirinha",
      id: "bairro-da-palmeirinha",
    },
    {
      number: "05",
      name: "Benevides Beraldo – Comendador",
      id: "benevides-beraldo-comendador",
    },
    {
      number: "06",
      name: "Carlos Alberto Pereira",
      id: "carlos-alberto-pereira",
    },
    {
      number: "07",
      name: "Eduardo Roberto Daher",
      id: "eduardo-roberto-daher",
    },
    {
      number: "08",
      name: "Jardim do Carmo",
      id: "jardim-do-carmo",
    },
    {
      number: "09",
      name: "Jardim Pedra Branca",
      id: "jardim-pedra-branca",
    },
    {
      number: "10",
      name: "João Ortiz Rodrigues",
      id: "joao-ortiz-rodrigues",
    },
    {
      number: "11",
      name: "Joaquim Fernando Paes de Barros Neto",
      id: "joaquim-fernando-paes-de-barros-neto",
    },
    {
      number: "12",
      name: "Levi Pereira Martins – Professor",
      id: "levi-pereira-martins-professor",
    },
    {
      number: "13",
      name: "Matilde Maria Cremm",
      id: "matilde-maria-cremm",
    },
    {
      number: "14",
      name: "Natércia Cremm de Moraes Pedro – Professora",
      id: "natercia-cremm-de-moraes-pedro-professora",
    },
    {
      number: "15",
      name: "Neide Celestina de Oliveira",
      id: "neide-celestina-de-oliveira",
    },
    {
      number: "16",
      name: "Oredo Rodrigues da Cruz",
      id: "oredo-rodrigues-da-cruz",
    },
    {
      number: "17",
      name: "Paulo de Castro Ferreira Junior – Jornalista",
      id: "paulo-de-castro-ferreira-junior-jornalista",
    },
    {
      number: "18",
      name: "Salvador de Leone",
      id: "salvador-de-leone",
    },
    {
      number: "19",
      name: "Sophia Maria Januária Amaral",
      id: "sophia-maria-januaria-amaral",
    },
  ];

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };

  const normalizeText = (value = "") => {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getSchoolName = (card) => {
    const title = card.querySelector(".school-card__title, h1, h2, h3");

    return (
      card.dataset.schoolName ||
      title?.textContent ||
      card.id.replaceAll("-", " ")
    ).trim();
  };

  const getSchoolNumber = (card, index) => {
    return String(card.dataset.schoolNumber || index + 1).padStart(2, "0");
  };

  const sortCardsByNumber = (cards) => {
    return [...cards].sort((a, b) => {
      const numberA = Number(a.dataset.schoolNumber || 999);
      const numberB = Number(b.dataset.schoolNumber || 999);

      if (numberA !== numberB) return numberA - numberB;

      return getSchoolName(a).localeCompare(getSchoolName(b), "pt-BR");
    });
  };

  const getTargetFromHash = () => {
    const hash = window.location.hash.slice(1);

    if (!hash) return null;

    try {
      return document.getElementById(decodeURIComponent(hash));
    } catch {
      return document.getElementById(hash);
    }
  };

  const createBackToTopButton = () => {
    const existingButton = document.getElementById(CONFIG.backToTopId);

    if (existingButton) return existingButton;

    const button = document.createElement("button");
    button.id = CONFIG.backToTopId;
    button.className = "back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "Voltar ao topo");
    button.textContent = "↑";

    document.body.appendChild(button);

    return button;
  };

  const createSearchStatus = (searchInput) => {
    if (!searchInput) return null;

    const existingStatus = document.getElementById("schoolSearchStatus");

    if (existingStatus) return existingStatus;

    const status = document.createElement("p");
    status.id = "schoolSearchStatus";
    status.className = "schools-search__status";
    status.setAttribute("aria-live", "polite");

    searchInput.insertAdjacentElement("afterend", status);

    return status;
  };

  const validateSchools = (cards) => {
    const foundById = new Map(cards.map((card) => [card.id, card]));
    const missingSchools = REQUIRED_SCHOOLS.filter(
      (school) => !foundById.has(school.id)
    );

    const duplicatedIds = cards
      .map((card) => card.id)
      .filter((id, index, ids) => id && ids.indexOf(id) !== index);

    const duplicatedNumbers = cards
      .map((card) => card.dataset.schoolNumber)
      .filter(Boolean)
      .filter((number, index, numbers) => numbers.indexOf(number) !== index);

    console.info(`[escolas.js] Ativo: ${cards.length} escolas encontradas.`);

    console.table(
      cards.map((card, index) => ({
        numero: getSchoolNumber(card, index),
        nome: getSchoolName(card),
        id: card.id || "SEM ID",
      }))
    );

    if (cards.length !== CONFIG.expectedSchoolCount) {
      console.warn(
        `[escolas.js] Atenção: eram esperadas ${CONFIG.expectedSchoolCount} escolas, mas foram encontradas ${cards.length}.`
      );
    }

    if (missingSchools.length > 0) {
      console.warn(
        "[escolas.js] Escolas esperadas que não foram encontradas no HTML:"
      );

      console.table(missingSchools);
    }

    if (duplicatedIds.length > 0) {
      console.warn("[escolas.js] IDs duplicados encontrados:", duplicatedIds);
    }

    if (duplicatedNumbers.length > 0) {
      console.warn(
        "[escolas.js] Números de escola duplicados encontrados:",
        duplicatedNumbers
      );
    }
  };

  const prepareCards = (cards) => {
    cards.forEach((card, index) => {
      if (!card.id) {
        console.warn(
          "[escolas.js] Existe uma section sem id. Ela não funcionará corretamente:",
          card
        );
      }

      if (!card.dataset.schoolCard) {
        card.setAttribute("data-school-card", "");
      }

      if (!card.dataset.schoolName) {
        card.dataset.schoolName = getSchoolName(card);
      }

      if (!card.dataset.schoolNumber) {
        card.dataset.schoolNumber = String(index + 1).padStart(2, "0");
      }
    });
  };

  const createQuickLinks = (cards) => {
    const quickLinks = document.getElementById(CONFIG.quickLinksId);

    if (!quickLinks) return;

    quickLinks.innerHTML = cards
      .map((card, index) => {
        const name = getSchoolName(card);
        const number = getSchoolNumber(card, index);

        return `
          <a 
            class="schools-index__link" 
            href="#${card.id}" 
            data-index-link="${card.id}"
          >
            <span class="schools-index__number">${number}</span>
            <span class="schools-index__name">${name}</span>
          </a>
        `;
      })
      .join("");
  };

  const clearTargetHighlight = (cards) => {
    cards.forEach((card) => card.classList.remove(CONFIG.targetClass));
  };

  const highlightFromHash = (cards, options = {}) => {
    const { scroll = false } = options;

    clearTargetHighlight(cards);

    const target = getTargetFromHash();

    if (!target) return;

    target.classList.add(CONFIG.targetClass);

    if (scroll) {
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    window.setTimeout(() => {
      target.classList.remove(CONFIG.targetClass);
    }, 2800);
  };

  const filterSchools = (cards, searchInput, searchStatus) => {
    if (!searchInput) return;

    const query = normalizeText(searchInput.value);
    const indexLinks = Array.from(document.querySelectorAll("[data-index-link]"));

    let visibleCount = 0;

    cards.forEach((card) => {
      const schoolName = normalizeText(getSchoolName(card));
      const isMatch = !query || schoolName.includes(query);

      card.classList.toggle(CONFIG.hiddenClass, !isMatch);

      if (isMatch) visibleCount += 1;
    });

    indexLinks.forEach((link) => {
      const card = document.getElementById(link.dataset.indexLink);
      const isHidden = Boolean(card?.classList.contains(CONFIG.hiddenClass));

      link.hidden = isHidden;
    });

    if (searchStatus) {
      if (!query) {
        searchStatus.textContent = `${cards.length} escolas cadastradas.`;
      } else if (visibleCount === 0) {
        searchStatus.textContent = "Nenhuma escola encontrada.";
      } else if (visibleCount === 1) {
        searchStatus.textContent = "1 escola encontrada.";
      } else {
        searchStatus.textContent = `${visibleCount} escolas encontradas.`;
      }
    }
  };

  const handleImageFallback = (cards) => {
    cards.forEach((card) => {
      const image = card.querySelector(".school-card__image, img");
      const fallback = card.querySelector(".school-card__image-fallback");

      if (!image) return;

      const setMissingImage = () => {
        card.classList.add("school-card--image-missing");

        if (fallback) {
          fallback.removeAttribute("aria-hidden");
        }
      };

      image.addEventListener("error", setMissingImage);

      if (image.complete && image.naturalWidth === 0) {
        setMissingImage();
      }
    });
  };

  const fallbackCopy = (text) => {
    const input = document.createElement("input");

    input.value = text;
    input.setAttribute("readonly", "readonly");
    input.style.position = "fixed";
    input.style.left = "-9999px";

    document.body.appendChild(input);

    input.select();
    document.execCommand("copy");

    input.remove();
  };

  const copySectionLink = async (button) => {
    const card = button.closest(CONFIG.cardSelector);

    if (!card || !card.id) return;

    const sectionLink = `${window.location.origin}${window.location.pathname}#${card.id}`;
    const originalText = button.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(sectionLink);
      } else {
        fallbackCopy(sectionLink);
      }

      button.textContent = "Link copiado!";
      button.disabled = true;

      window.setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1600);
    } catch {
      window.prompt("Copie o link da escola:", sectionLink);
    }
  };

  const observeActiveSection = (cards) => {
    const indexLinks = Array.from(document.querySelectorAll("[data-index-link]"));

    if (!indexLinks.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        indexLinks.forEach((link) => {
          link.classList.toggle(
            CONFIG.activeClass,
            link.dataset.indexLink === visibleEntry.target.id
          );
        });
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-120px 0px -45% 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));
  };

  const handleBackToTop = (button) => {
    if (!button) return;

    const toggleButton = () => {
      button.classList.toggle(CONFIG.backToTopVisibleClass, window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleButton, { passive: true });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    toggleButton();
  };

  const bindEvents = (cards, searchInput, searchStatus) => {
    searchInput?.addEventListener("input", () => {
      filterSchools(cards, searchInput, searchStatus);
    });

    window.addEventListener("hashchange", () => {
      highlightFromHash(cards, { scroll: true });
    });

    document.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-copy-section]");

      if (copyButton) {
        copySectionLink(copyButton);
      }
    });
  };

  onReady(() => {
    const rawCards = Array.from(document.querySelectorAll(CONFIG.cardSelector));

    if (!rawCards.length) {
      console.warn(
        "[escolas.js] Nenhuma escola encontrada. Verifique se cada section possui class='school-card', id e data-school-card."
      );

      return;
    }

    prepareCards(rawCards);

    const cards = sortCardsByNumber(rawCards);
    const searchInput = document.getElementById(CONFIG.searchInputId);
    const searchStatus = createSearchStatus(searchInput);
    const backToTopButton = createBackToTopButton();

    validateSchools(cards);
    createQuickLinks(cards);
    handleImageFallback(cards);
    filterSchools(cards, searchInput, searchStatus);
    observeActiveSection(cards);
    handleBackToTop(backToTopButton);
    bindEvents(cards, searchInput, searchStatus);
    highlightFromHash(cards, { scroll: Boolean(window.location.hash) });
  });
})();