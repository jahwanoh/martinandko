const menu = document.querySelector("#site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (typeof menu.showModal === "function") {
  document.documentElement.classList.add("has-site-menu");
  menuToggle.hidden = false;

  menuToggle.addEventListener("click", () => {
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
  });
  menu.querySelector(".menu-close").addEventListener("click", () => menu.close());
  menu.addEventListener("close", () => menuToggle.setAttribute("aria-expanded", "false"));

  menu.addEventListener("click", (event) => {
    const bounds = menu.getBoundingClientRect();
    const outsidePanel = event.target === menu &&
      (event.clientX < bounds.left || event.clientX > bounds.right);
    if (outsidePanel || event.target.closest("a[href^='#']")) menu.close();
  });
}

const services = document.querySelector(".service-grid");
const serviceControls = document.querySelector(".service-controls");
const [previousService, nextService] = serviceControls.querySelectorAll("button");

function updateServiceControls() {
  const maxScroll = services.scrollWidth - services.clientWidth;
  serviceControls.hidden = maxScroll < 2;
  previousService.disabled = services.scrollLeft < 2;
  nextService.disabled = services.scrollLeft >= maxScroll - 2;
}

serviceControls.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const firstCard = services.firstElementChild;
  const gap = parseFloat(getComputedStyle(services).columnGap);
  services.scrollBy({
    left: Number(button.dataset.direction) * (firstCard.offsetWidth + gap),
    behavior: reduceMotion.matches ? "instant" : "smooth",
  });
});
services.addEventListener("scroll", updateServiceControls, { passive: true });
window.addEventListener("resize", updateServiceControls);
updateServiceControls();

const hero = document.querySelector(".hero");
let pendingFrame = 0;

function updateHero() {
  const offset = reduceMotion.matches ? 0 : Math.min(Math.max(window.scrollY, 0), hero.offsetHeight);
  hero.style.setProperty("--hero-offset", `${offset * 0.16}px`);
  pendingFrame = 0;
}

function requestHeroUpdate() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(updateHero);
}

window.addEventListener("scroll", requestHeroUpdate, { passive: true });
window.addEventListener("resize", requestHeroUpdate);
reduceMotion.addEventListener("change", requestHeroUpdate);
updateHero();

if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("has-entered");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll("[data-reveal]").forEach((element) => reveal.observe(element));
}
