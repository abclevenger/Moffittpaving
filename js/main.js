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
  var mqMobile = window.matchMedia("(max-width: 768px)");

  function syncNavTabindex() {
    if (!nav) return;
    var open = nav.classList.contains("is-open");
    var mobile = mqMobile.matches;
    nav.querySelectorAll("a").forEach(function (a) {
      a.tabIndex = mobile && !open ? -1 : 0;
    });
  }

  function setMenuOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    syncNavTabindex();
    if (mqMobile.matches) {
      if (open) {
        var first = nav.querySelector("a");
        if (first) window.requestAnimationFrame(function () { first.focus(); });
      } else {
        toggle.focus();
      }
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    nav.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function () {
        if (mqMobile.matches) setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenuOpen(false);
    });

    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== "Tab" || !nav.classList.contains("is-open") || !mqMobile.matches) return;
        var links = nav.querySelectorAll("a");
        if (!links.length) return;
        var first = links[0];
        var last = links[links.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          toggle.focus();
        }
      },
      true
    );

    function onMqChange() {
      syncNavTabindex();
      if (!mqMobile.matches) setMenuOpen(false);
    }
    if (mqMobile.addEventListener) {
      mqMobile.addEventListener("change", onMqChange);
    } else if (mqMobile.addListener) {
      mqMobile.addListener(onMqChange);
    }
    syncNavTabindex();
  }

  document.querySelectorAll(".faq-item").forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (!details.open) return;
      document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== details) other.open = false;
      });
    });
  });

  var toastEl = document.getElementById("toast-announcer");
  document.querySelectorAll(".copy-phone-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      function announce(msg) {
        if (toastEl) toastEl.textContent = msg;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            announce("Phone number copied to clipboard.");
            btn.textContent = "Copied!";
            window.setTimeout(function () {
              btn.textContent = "Copy";
            }, 2000);
          },
          function () {
            announce("Could not copy—try selecting the number or dialing from the link.");
          }
        );
      } else {
        announce("Copy not supported—try selecting the number or dialing from the link.");
      }
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
        form.classList.add("contact-form--attempted");
        form.reportValidity();
        statusEl.textContent = "";
        statusEl.innerHTML = "";
        statusEl.className = "form-status";
        return;
      }

      form.classList.remove("contact-form--attempted");

      var hp = form.querySelector(".form-hp");
      if (hp && hp.value) {
        statusEl.textContent = "Thanks—we’ll be in touch.";
        statusEl.className = "form-status form-status--success";
        form.classList.remove("contact-form--attempted");
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
