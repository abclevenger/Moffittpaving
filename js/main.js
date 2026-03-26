(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

  var form = document.querySelector(".contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("contact-submit");

  if (form && statusEl && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        statusEl.textContent = "";
        statusEl.className = "form-status";
        return;
      }

      var hp = form.querySelector(".form-hp");
      if (hp && hp.value) {
        statusEl.textContent = "Thanks—we’ll be in touch.";
        statusEl.className = "form-status form-status--success";
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");

      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        statusEl.className = "form-status form-status--info";
        statusEl.innerHTML =
          "<strong>Demo mode.</strong> This message is a preview—hook the form to Formspree, Netlify Forms, or your email so requests go straight to your inbox. Calling the number above always works.";
        statusEl.focus();
      }, 450);
    });
  }
})();
