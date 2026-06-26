function initNumero() {
  const btn = document.getElementById("btn-numero");
  const input = document.getElementById("input-numero");
  const copier = document.getElementById("copier-numero");

  if (btn && input) {
    btn.onclick = function () {
      const prefixes = ["032", "033", "034", "037", "038"];
      const prefixe = prefixes[Math.floor(Math.random() * prefixes.length)];
      // Sécurité : Vérifie si la fonction partagée est bien chargée
      if (typeof genererChiffres === "function") {
        input.value = prefixe + genererChiffres(7);
      }
    };
  }

  if (copier && input) {
    copier.onclick = function () {
      copierTexte(input.id, this);
    };
  }
}

window.initNumero = initNumero;
