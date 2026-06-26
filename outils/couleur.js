function initCouleur() {
  const canvas = document.getElementById("canvas-couleur");
  const input = document.getElementById("input-couleur");
  const apercu = document.getElementById("apercu-couleur");
  const toast = document.getElementById("toast-copie");

  if (!canvas || !input || !apercu) return;

  const size = 200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const h = x / size;
      const s = 1 - y / size;
      const [r, g, b] = hsvToRgb(h, s, 1);
      const idx = (y * size + x) * 4;
      data[idx] = Math.round(r * 255);
      data[idx + 1] = Math.round(g * 255);
      data[idx + 2] = Math.round(b * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // SURVOL : affiche la couleur hexa
  canvas.onmousemove = function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < size && y >= 0 && y < size) {
      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        input.value = hex.toUpperCase();
        apercu.style.backgroundColor = hex;
      } catch (err) {
        // Securite si changement de page rapide
      }
    }
  };

  // TOAST : Afficher le toast
  function showToast() {
    if (!toast) return;
    toast.classList.add("visible");
    // Cacher apres 2 secondes
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("visible");
    }, 700);
  }

  // COPIE : par clic ,copie sur le presse papier
  canvas.onclick = function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < size && y >= 0 && y < size) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]).toUpperCase();
      input.value = hex;
      apercu.style.backgroundColor = hex;

      navigator.clipboard
        .writeText(hex)
        .then(() => {
          // Feedback visuel : bordure verte
          apercu.style.borderColor = "#28a745";
          setTimeout(() => {
            apercu.style.borderColor = "";
          }, 800);

          // TOAST : Afficher le toast
          showToast();
        })
        .catch(() => {
          input.select();
          document.execCommand("copy");
          showToast();
        });
    }
  };

  // COPIE : Copie manuelle
  input.addEventListener("input", function () {
    let val = this.value.trim();
    if (val.startsWith("#") && val.length === 7) {
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        apercu.style.backgroundColor = val;
      }
    } else if (val.length === 6 && /^[0-9A-Fa-f]{6}$/.test(val)) {
      apercu.style.backgroundColor = "#" + val;
    }
  });
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

window.initCouleur = initCouleur;
