/* ==========================================================================
   bnvac.com — Ben Vaccaro
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   with scripting off the page is still complete and readable.

   1. theme        light / dark, remembered, follows the OS until you choose
   2. greedy nav   keeps the masthead to one row, overflow in a menu
   3. scrollspy    highlights the section you're reading
   4. filters      experience by category
   5. copy         email to clipboard
   ========================================================================== */

(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var root  = document.documentElement;
  var toast = $("#toast");
  var toastTimer;

  function flash(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-up");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-up"); }, 1800);
  }

  /* ------------------------------- 1. Theme ------------------------------- */

  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  function setTheme(next) {
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}

    // Keep the browser chrome in step with the page.
    var color = next === "dark" ? "#09090b" : "#ffffff";
    $$('meta[name="theme-color"]').forEach(function (tag) { tag.setAttribute("content", color); });
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    paintSwitch();
    return next;
  }

  // Two labeled buttons rather than one icon, so the current theme is legible.
  var themeSwitch = $("#themeswitch");

  function paintSwitch() {
    if (!themeSwitch) return;
    var now = currentTheme();
    $$("button", themeSwitch).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeSet === now));
    });
  }

  if (themeSwitch) {
    themeSwitch.addEventListener("click", function (event) {
      var button = event.target.closest("[data-theme-set]");
      if (!button) return;
      setTheme(button.dataset.themeSet);
      paintSwitch();
    });
    paintSwitch();
    // Follow the OS while the visitor has not chosen for themselves.
    media.addEventListener("change", function () {
      if (!root.dataset.theme) paintSwitch();
    });
  }

  /* ---------------------------- 2. Greedy nav ----------------------------- */

  // The template keeps the masthead to a single row: links that no longer fit
  // move into an overflow menu, and come back when the window widens.
  var nav      = $("#site-nav");
  var navVisible  = $(".visible-links", nav);
  var navHidden   = $(".hidden-links", nav);
  var navMore  = $(".greedy-nav__toggle", nav);

  function movable() {
    return $$(".masthead__menu-item", navVisible).filter(function (li) {
      return !li.classList.contains("masthead__menu-item--lg") &&
             !li.classList.contains("tail");
    });
  }

  function fitNav() {
    while (navHidden.firstChild) {
      navVisible.insertBefore(navHidden.firstChild, $(".tail", navVisible));
    }
    navMore.hidden = true;
    navHidden.hidden = true;

    var items = movable();
    var i = items.length - 1;
    while (navVisible.scrollWidth > navVisible.clientWidth + 1 && i >= 0) {
      navHidden.insertBefore(items[i], navHidden.firstChild);
      navMore.hidden = false;
      i--;
    }
  }

  if (nav && navVisible && navHidden && navMore) {
    fitNav();
    // Fonts and images settle after first paint; re-fit once they have.
    window.addEventListener("load", fitNav);
    var fitTimer;
    window.addEventListener("resize", function () {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(fitNav, 120);
    }, { passive: true });

    navMore.addEventListener("click", function () {
      var open = navMore.getAttribute("aria-expanded") === "true";
      navMore.setAttribute("aria-expanded", String(!open));
      navHidden.hidden = open;
    });

    document.addEventListener("click", function (event) {
      if (nav.contains(event.target)) return;
      navMore.setAttribute("aria-expanded", "false");
      navHidden.hidden = true;
    });

    navHidden.addEventListener("click", function () {
      navMore.setAttribute("aria-expanded", "false");
      navHidden.hidden = true;
    });
  }

  /* ----------------------------- 3. Scrollspy ----------------------------- */

  // Every masthead section link except the site title, which repeats #about.
  var navLinks = $$('.masthead__menu-item:not(.masthead__menu-item--lg) a[href^="#"]');
  var sections = navLinks
    .map(function (link) { return document.getElementById(link.hash.slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();

    var spy = new IntersectionObserver(function (records) {
      records.forEach(function (record) {
        visible.set(record.target.id, record.isIntersecting ? record.intersectionRatio : 0);
      });

      var bestId = null;
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });

      if (!bestId) return;
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.hash === "#" + bestId);
      });
    }, {
      rootMargin: "-12% 0px -55% 0px",
      threshold: [0, 0.15, 0.4, 0.75, 1]
    });

    sections.forEach(function (section) { spy.observe(section); });

    // At the very bottom a short final section can never win on visible area,
    // so the last section is the one being read no matter what the ratios say.
    window.addEventListener("scroll", function () {
      var atEnd = window.innerHeight + window.scrollY >=
                  document.documentElement.scrollHeight - 8;
      if (!atEnd) return;
      var last = "#" + sections[sections.length - 1].id;
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.hash === last);
      });
    }, { passive: true });
  }

  /* ------------------------------ 4. Filters ------------------------------ */

  var filterBar = $("#exp-filters");
  var entries   = $$("#exp-list .entry");
  var emptyNote = $("#exp-empty");

  if (filterBar && entries.length) {
    filterBar.hidden = false; // only useful once JS can act on it

    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest(".chip");
      if (!button) return;

      var want = button.dataset.filter;

      $$(".chip", filterBar).forEach(function (chip) {
        var on = chip === button;
        chip.classList.toggle("is-on", on);
        chip.setAttribute("aria-pressed", String(on));
      });

      var shown = 0;
      entries.forEach(function (entry) {
        var match = want === "all" || entry.dataset.cat === want;
        entry.hidden = !match;
        if (match) {
          shown++;
          // Re-trigger the entrance animation so filtering feels responsive.
          entry.style.animation = "none";
          void entry.offsetWidth;
          entry.style.animation = "";
        }
      });

      if (emptyNote) emptyNote.hidden = shown > 0;
    });
  }

  /* ------------------------------- 5. Copy -------------------------------- */

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts (e.g. plain-http previews).
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;top:-9999px;opacity:0";
      document.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(field);
      ok ? resolve() : reject();
    });
  }

  var copyButton = $("#copy-email");
  if (copyButton) {
    copyButton.addEventListener("click", function () {
      var address = copyButton.dataset.email;
      copy(address).then(function () {
        copyButton.classList.add("is-done");
        $(".copy-label", copyButton).textContent = "Copied";
        flash("Email copied to clipboard");
        setTimeout(function () {
          copyButton.classList.remove("is-done");
          $(".copy-label", copyButton).textContent = "Copy";
        }, 2000);
      }).catch(function () {
        flash("Couldn't copy — " + address);
      });
    });
  }

})();
