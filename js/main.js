(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.getElementById("site-header");
  var scrollTicking = false;

  function onScroll() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("site-header--scrolled", y > 16);
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  var backBtn = document.getElementById("back-to-top");
  if (backBtn) {
    function syncBackToTop() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var show = y > 420;
      backBtn.hidden = !show;
      backBtn.setAttribute("aria-hidden", show ? "false" : "true");
    }
    window.addEventListener(
      "scroll",
      function () {
        syncBackToTop();
      },
      { passive: true }
    );
    syncBackToTop();
    backBtn.addEventListener("click", function () {
      var prefersReduced =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenuOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    nav.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (!details.open) return;
      document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== details) other.open = false;
      });
    });
  });

  var form = document.querySelector(".contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("contact-submit");
  var submitLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;

  function setSubmitLoading(loading) {
    if (!submitBtn || !submitLabel) return;
    if (!submitLabel.getAttribute("data-default")) {
      submitLabel.setAttribute("data-default", submitLabel.textContent);
    }
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", loading ? "true" : "false");
    submitLabel.textContent = loading ? "Sending…" : submitLabel.getAttribute("data-default") || "Send request";
  }

  if (form && statusEl && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        statusEl.textContent = "";
        statusEl.innerHTML = "";
        statusEl.className = "form-status";
        return;
      }

      var hp = form.querySelector(".form-hp");
      if (hp && hp.value) {
        statusEl.textContent = "Thanks—we’ll be in touch.";
        statusEl.className = "form-status form-status--success";
        form.reset();
        setSubmitLoading(false);
        return;
      }

      setSubmitLoading(true);
      statusEl.textContent = "";
      statusEl.innerHTML = "";
      statusEl.className = "form-status";

      window.setTimeout(function () {
        setSubmitLoading(false);
        statusEl.className = "form-status form-status--info";
        statusEl.innerHTML =
          "<strong>Demo mode.</strong> This message is a preview—hook the form to Formspree, Netlify Forms, or your email so requests go straight to your inbox. Calling the number above always works.";
        statusEl.focus();
      }, 550);
    });
  }
})();
