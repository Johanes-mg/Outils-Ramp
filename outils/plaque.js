function initPlaque() {
  const btn = document.getElementById("btn-plaque");
  const input = document.getElementById("input-plaque");
  const copier = document.getElementById("copier-plaque");

  if (btn && input) {
    btn.onclick = function () {
      if (
        typeof genererChiffres === "function" &&
        typeof genererLettres === "function"
      ) {
        // Ajout de l'espace réglementaire pour le format officiel Malagasy "ex: 1234ABC"
        input.value = genererChiffres(4) + genererLettres(3);
      }
    };
  }

  if (copier && input) {
    copier.onclick = function () {
      copierTexte(input.id, this);
    };
  }
}

window.initPlaque = initPlaque;
