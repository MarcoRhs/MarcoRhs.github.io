document.documentElement.classList.add("js");

const byId = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealItems = [...document.querySelectorAll(".reveal")];
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: .08 });

  revealItems.forEach(item => {
    item.classList.add("reveal-ready");
    if (item.getBoundingClientRect().top < window.innerHeight * .94) item.classList.add("is-visible");
    else revealObserver.observe(item);
  });
}

const navToggle = byId("navToggle");
const navLinks = byId("nav-links");
if (navToggle && navLinks) {
  const setNav = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navLinks.classList.toggle("is-open", open);
  };
  navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
  navLinks.addEventListener("click", event => {
    if (event.target.closest(".nav-link")) setNav(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("#nav-links") && !event.target.closest("#navToggle")) setNav(false);
  });
}
