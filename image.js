
const galleryItems = [
  ...document.querySelectorAll(".gallery-item")
];

const filterButtons = [
  ...document.querySelectorAll(".filter")
];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const count = document.getElementById("count");

let visibleItems = [...galleryItems];
let currentIndex = 0;
let lastFocusedElement = null;

// Update the gallery according to the selected category
function filterGallery(category) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  galleryItems.forEach((item) => {
    const matches =
      category === "all" ||
      item.dataset.category === category;

    item.classList.toggle("hidden", !matches);
  });

  visibleItems = galleryItems.filter(
    (item) => !item.classList.contains("hidden")
  );

  count.textContent =
    `${visibleItems.length} ${visibleItems.length === 1 ? "image" : "images"}`;
}

// Handle category buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterGallery(button.dataset.category);
  });
});

// Get the image and title from a gallery card
function getImageData(item) {
  return {
    src: item.querySelector("img").src,
    alt: item.querySelector("img").alt,
    title: item.dataset.title
  };
}

// Display the current image inside the lightbox
function showImage(index) {
  if (visibleItems.length === 0) return;

  currentIndex =
    (index + visibleItems.length) % visibleItems.length;

  const image = getImageData(visibleItems[currentIndex]);

  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightboxTitle.textContent = image.title;
  lightboxCounter.textContent =
    `${currentIndex + 1} / ${visibleItems.length}`;

  prevBtn.disabled = visibleItems.length < 2;
  nextBtn.disabled = visibleItems.length < 2;
}

// Open the lightbox
function openLightbox(item) {
  currentIndex = visibleItems.indexOf(item);

  if (currentIndex === -1) return;

  lastFocusedElement = document.activeElement;
  showImage(currentIndex);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Click an image to open the viewer
galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

// Next and Previous navigation
nextBtn.addEventListener("click", () => {
  showImage(currentIndex + 1);
});

prevBtn.addEventListener("click", () => {
  showImage(currentIndex - 1);
});

closeBtn.addEventListener("click", closeLightbox);

// Clicking the dark background closes the viewer
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    showImage(currentIndex + 1);
  } else if (event.key === "ArrowLeft") {
    showImage(currentIndex - 1);
  }
});

// Initialize the gallery
filterGallery("all");
