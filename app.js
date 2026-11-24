const assemblyStage = document.querySelector("#assembly-stage");
const assemblyCaption = document.querySelector("#assembly-caption");
const assemblyButton = document.querySelector("#animate");
const partButtons = Array.from(document.querySelectorAll("[data-part]"));
const parts = [
  { id: "cooler", description: "Water cooler SuperFrame de 240 mm. O bloco circular fica sobre o processador." },
  { id: "ram", description: "Corsair Dominator Platinum White. Os módulos iluminados somam 16 GB DDR4." },
  { id: "gpu", description: "GeForce RTX 3080 AFOX com 10 GB. A placa fica na horizontal, abaixo do processador." }
];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let assemblyTimers = [];

function resetAssembly() {
  assemblyTimers.forEach((timer) => window.clearTimeout(timer));
  assemblyTimers = [];
  delete assemblyStage.dataset.part;
  assemblyStage.classList.remove("is-assembling");
  assemblyStage.querySelectorAll(".part").forEach((part) => part.classList.remove("is-placed"));
  partButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
}

partButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.getAttribute("aria-pressed") === "true";
    resetAssembly();
    if (selected) {
      assemblyCaption.textContent = "Selecione uma peça para destacá-la.";
      return;
    }

    const part = parts.find(({ id }) => id === button.dataset.part);
    assemblyStage.dataset.part = part.id;
    button.setAttribute("aria-pressed", "true");
    assemblyCaption.textContent = part.description;
  });
});

assemblyButton.addEventListener("click", () => {
  resetAssembly();
  if (reducedMotion.matches) {
    assemblyCaption.textContent = "Montagem completa. Selecione uma peça para ver sua posição.";
    return;
  }

  assemblyStage.classList.add("is-assembling");
  assemblyCaption.textContent = "Montagem em andamento…";
  parts.forEach(({ id }, index) => {
    const part = assemblyStage.querySelector(`.part-${id}`);
    assemblyTimers.push(window.setTimeout(() => part.classList.add("is-placed"), 160 + index * 370));
  });
  assemblyTimers.push(window.setTimeout(() => {
    resetAssembly();
    assemblyCaption.textContent = "Montagem completa. Selecione uma peça para ver sua posição.";
  }, 1540));
});
document.querySelector(".assembly-controls").hidden = false;

const photos = Array.from(document.querySelectorAll(".gallery-link"));
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const photoCount = document.querySelector("#photo-count");
let photoIndex = 0;
let galleryOpener;

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const link = photos[photoIndex];
  lightboxImage.alt = link.querySelector("img").alt;
  lightboxImage.src = link.href;
  lightboxCaption.textContent = link.closest("figure").querySelector("figcaption").textContent;
  photoCount.textContent = `${photoIndex + 1} / ${photos.length}`;
}

if (typeof lightbox.showModal === "function") {
  photos.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      galleryOpener = link;
      showPhoto(index);
      lightbox.showModal();
    });
  });

  document.querySelector("#prev-photo").addEventListener("click", () => showPhoto(photoIndex - 1));
  document.querySelector("#next-photo").addEventListener("click", () => showPhoto(photoIndex + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      lightbox.close();
    }
  });
  lightbox.addEventListener("close", () => galleryOpener?.focus());
}
