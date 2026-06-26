// Theme
function basculerTheme() {
  const root = document.documentElement;
  const icon = document.getElementById("icon-theme");
  if (!icon) return;

  if (root.dataset.theme === "clair") {
    delete root.dataset.theme;
    icon.src = "images/mode-sombre.png";
  } else {
    root.dataset.theme = "clair";
    icon.src = "images/mode-clair.png";
  }
}

// Sous-menu Outils
function toggleSousMenu(event) {
  if (event) event.stopPropagation();

  const sousMenu = document.getElementById("sous-menu-outils");
  const parentBtn = document.getElementById("btn-outils");
  if (!sousMenu || !parentBtn) return;

  const estOuvert = sousMenu.classList.toggle("ouvert");
  parentBtn.classList.toggle("ouvert");
  parentBtn.setAttribute("aria-expanded", estOuvert);
}

// Navigation
function changerOnglet(page) {
  document
    .querySelectorAll(".onglet")
    .forEach((b) => b.classList.remove("actif"));

  document
    .querySelectorAll(`.onglet[data-page="${page}"]`)
    .forEach((onglet) => onglet.classList.add("actif"));

  chargerPage(page);
}

// Charger une page
function chargerPage(page) {
  const main = document.getElementById("main-content");
  if (!main) return;

  const pagesStatiques = ["accueil", "outils", "apropos", "infos"];
  const estStatique = pagesStatiques.includes(page);
  const dossier = estStatique ? "pages" : "outils";

  fetch(`${dossier}/${page}.html`)
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.text();
    })
    .then((html) => {
      main.innerHTML = html;
      const pageEl = document.getElementById(`page-${page}`);
      if (pageEl) {
        document
          .querySelectorAll(".page")
          .forEach((p) => p.classList.remove("actif"));
        pageEl.classList.add("actif");
      }
      if (!estStatique) {
        chargerScriptCommun(() => chargerScriptOutil(page));
      }
    })
    .catch(() => {
      main.innerHTML = `<div class="page actif" style="padding:20px 24px;"><p style="color:#ff6b6b;">Erreur: impossible de charger la page "${page}".</p></div>`;
    });
}

// Charger les scripts communs
function chargerScriptCommun(callback) {
  if (document.getElementById("script-outils-commun")) {
    if (callback) callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "outils/outils-commun.js";
  script.id = "script-outils-commun";
  script.onload = callback;
  document.body.appendChild(script);
}

// Charger un script d'outil
function chargerScriptOutil(nom) {
  const ancien = document.getElementById(`script-${nom}`);
  if (ancien) ancien.remove();

  const script = document.createElement("script");
  script.src = `outils/${nom}.js`;
  script.id = `script-${nom}`;
  script.onload = () => {
    const initFn = `init${nom.charAt(0).toUpperCase() + nom.slice(1)}`;
    if (typeof window[initFn] === "function") window[initFn]();
  };
  document.body.appendChild(script);
}

// Copier texte unifié
function copierTexte(id, bouton) {
  const input = document.getElementById(id);
  if (!input || !input.value) return;

  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      const original = bouton.innerHTML;
      bouton.innerHTML = "Copié !";
      setTimeout(() => (bouton.innerHTML = original), 1200);
    })
    .catch(() => {
      input.select();
      document.execCommand("copy");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  chargerPage("accueil");

  // Fermer le sous-menu si on clique ailleurs
  document.addEventListener("click", () => {
    const sousMenu = document.getElementById("sous-menu-outils");
    const parentBtn = document.getElementById("btn-outils");
    if (sousMenu && sousMenu.classList.contains("ouvert")) {
      sousMenu.classList.remove("ouvert");
      parentBtn.classList.remove("ouvert");
    }
  });
});

window.chargerPage = chargerPage;
window.changerOnglet = changerOnglet;
window.toggleSousMenu = toggleSousMenu;
window.basculerTheme = basculerTheme;
window.copierTexte = copierTexte;
