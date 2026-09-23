const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const navLinks = [...document.querySelectorAll(".nav-links a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -60% 0px" },
  );
  navSections.forEach((section) => navObserver.observe(section));
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");
const closeButton = lightbox.querySelector(".lightbox-close");

document.querySelectorAll("[data-image]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.querySelector("img")?.alt || "Expanded project image";
    lightboxCaption.textContent = button.dataset.caption || "Project image";
    lightbox.showModal();
  });
});

const closeLightbox = () => {
  lightbox.close();
  lightboxImage.src = "";
};

closeButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) closeLightbox();
});
