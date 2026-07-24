(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Mobile nav toggle
  ---------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----------------------------------------------------------
     Scroll-triggered reveal animation
  ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min(i * 40, 200);
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     Active nav link on scroll
  ---------------------------------------------------------- */
  var sections = ["about", "work", "journey", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll(".nav-list a");

  function setActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var currentId = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href").replace("#", "");
      link.style.color = href === currentId ? "var(--ink)" : "";
    });
  }

  var scrollTicking = false;
  window.addEventListener("scroll", function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        setActiveLink();
        toggleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  setActiveLink();

  /* ----------------------------------------------------------
     Back to top button
  ---------------------------------------------------------- */
  var toTopBtn = document.getElementById("toTop");

  function toggleBackToTop() {
    if (!toTopBtn) return;
    toTopBtn.style.opacity = window.scrollY > 600 ? "1" : "0.35";
  }
  toggleBackToTop();

  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ----------------------------------------------------------
     Smooth-scroll for in-page anchors (fallback safety)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });
})();