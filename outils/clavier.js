function initClavier() {
  const textarea = document.getElementById("clavier-texte");
  const btnCopier = document.getElementById("btn-copier-texte");
  const btnEffacer = document.getElementById("btn-effacer");
  const toast = document.getElementById("toast-copie");
  const mainContent = document.getElementById("main-content");

  let scrollPosition = 0;

  function sauvegarderPosition() {
    if (mainContent) {
      scrollPosition = mainContent.scrollTop;
    }
  }

  function restaurerPosition() {
    if (mainContent) {
      requestAnimationFrame(() => {
        mainContent.scrollTop = scrollPosition;
      });
      setTimeout(() => {
        mainContent.scrollTop = scrollPosition;
      }, 10);
    }
  }

  function ajouterCaractere(caractere) {
    if (caractere) {
      sauvegarderPosition();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      textarea.value =
        text.substring(0, start) + caractere + text.substring(end);

      const newPosition = start + caractere.length;
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;

      restaurerPosition();
    }
  }

  document.querySelectorAll(".caractere").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const caractere = this.dataset.caractere;
      if (caractere) {
        ajouterCaractere(caractere);

        this.classList.add("caractere-active");
        setTimeout(() => {
          this.classList.remove("caractere-active");
        }, 200);
      }
      return false;
    });
  });

  if (btnCopier) {
    btnCopier.onclick = function (e) {
      e.preventDefault();
      if (textarea.value) {
        sauvegarderPosition();
        navigator.clipboard
          .writeText(textarea.value)
          .then(() => {
            showToast("Texte copié !");
            restaurerPosition();
          })
          .catch(() => {
            textarea.select();
            document.execCommand("copy");
            showToast("Texte copié !");
            restaurerPosition();
          });
      }
    };
  }

  if (btnEffacer) {
    btnEffacer.onclick = function (e) {
      e.preventDefault();
      sauvegarderPosition();
      textarea.value = "";
      textarea.focus();
      showToast("Texte effacé");
      restaurerPosition();
    };
  }

  if (mainContent) {
    mainContent.addEventListener("scroll", function () {
      scrollPosition = this.scrollTop;
    });
    setTimeout(() => {
      scrollPosition = mainContent.scrollTop;
    }, 100);
  }

  textarea.addEventListener("focus", function () {
    setTimeout(() => {
      restaurerPosition();
    }, 0);
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message || "Texte copié !";
    toast.classList.add("visible");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("visible");
    }, 700);
  }

  setTimeout(sauvegarderPosition, 200);
}

window.initClavier = initClavier;
