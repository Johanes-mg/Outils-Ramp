// Pour éliminer les redondances de codes ou des fonctions

function aleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genererChiffres(longueur) {
  let result = "";
  for (let i = 0; i < longueur; i++) {
    result += aleatoire(0, 9);
  }
  return result;
}

function genererLettres(longueur) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < longueur; i++) {
    result += alphabet[aleatoire(0, 25)];
  }
  return result;
}
