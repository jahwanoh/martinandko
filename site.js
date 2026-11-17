const menu = document.querySelector("#mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const mobileLayout = window.matchMedia("(max-width: 740px)");

if (typeof menu.showModal === "function") {
  menuToggle.hidden = false;
  document.documentElement.classList.add("has-mobile-menu");

  menuToggle.addEventListener("click", () => menu.showModal());
  menu.querySelector(".menu-close").addEventListener("click", () => menu.close());

  menu.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a[href^='#']")) {
      menu.close();
    }
  });

  mobileLayout.addEventListener("change", ({ matches }) => {
    if (!matches && menu.open) menu.close();
  });
}
