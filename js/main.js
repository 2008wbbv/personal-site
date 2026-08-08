/* ==========================================================================
   bnvac.com — Ben Vaccaro
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   with scripting off the page is still complete and readable.

   1. theme        light / dark, remembered, follows the OS until you choose
   2. scrollspy    highlights the section you're reading
   3. filters      experience by category
   4. copy         email to clipboard
   5. palette      ⌘K / Ctrl-K quick navigation
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
    return next;
  }

  var themeButton = $("#theme-toggle");
  if (themeButton) {
    themeButton.addEventListener("click", function () { toggleTheme(); });
  }

  /* ----------------------------- 2. Scrollspy ----------------------------- */

  var navLinks = $$(".sidenav a");
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
  }

  /* ------------------------------ 3. Filters ------------------------------ */

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

  /* ------------------------------- 4. Copy -------------------------------- */

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

  /* ----------------------------- 5. Palette ------------------------------- */

  var palette   = $("#palette");
  var paletteIn = $("#palette-input");
  var list      = $("#palette-list");
  var noResults = $("#palette-empty");
  var openers   = [$("#palette-open")].filter(Boolean);

  var commands = [
    { label: "About",              hint: "section", icon: "#i-arrow",     run: function () { go("#about"); } },
    { label: "Experience",         hint: "section", icon: "#i-arrow",     run: function () { go("#experience"); } },
    { label: "Research & Projects",hint: "section", icon: "#i-arrow",     run: function () { go("#work"); } },
    { label: "Awards & Honors",    hint: "section", icon: "#i-arrow",     run: function () { go("#awards"); } },
    { label: "Writing",            hint: "section", icon: "#i-arrow",     run: function () { go("#writing"); } },
    { label: "Contact",            hint: "section", icon: "#i-arrow",     run: function () { go("#contact"); } },
    { label: "View CV",            hint: "page",    icon: "#i-doc",       run: function () { location.href = "cv.html"; } },
    { label: "Email Ben",          hint: "benvaccaro@proton.me", icon: "#i-mail", run: function () { location.href = "mailto:benvaccaro@proton.me"; } },
    { label: "Copy email address", hint: "clipboard", icon: "#i-copy",    run: function () {
        copy("benvaccaro@proton.me").then(function () { flash("Email copied to clipboard"); });
      } },
    { label: "GitHub",             hint: "2008wbbv", icon: "#i-github",   run: function () { open_("https://github.com/2008wbbv"); } },
    { label: "LinkedIn",           hint: "in/bnvac", icon: "#i-linkedin", run: function () { open_("https://www.linkedin.com/in/bnvac"); } },
    { label: "Substack",           hint: "bnvac.substack.com", icon: "#i-substack", run: function () { open_("https://bnvac.substack.com"); } },
    { label: "Instagram",          hint: "@bnvac",  icon: "#i-instagram", run: function () { open_("https://instagram.com/bnvac"); } },
    { label: "Toggle theme",       hint: "light / dark", icon: "#i-moon", run: function () {
        flash(toggleTheme() === "dark" ? "Dark theme" : "Light theme");
      } }
  ];

  function go(hash) {
    var target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", hash);
  }

  function open_(url) {
    window.open(url, "_blank", "noopener");
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  var matches = [];
  var cursor  = 0;

  function score(command, query) {
    var haystack = (command.label + " " + command.hint).toLowerCase();
    if (!query) return 1;
    if (haystack.indexOf(query) !== -1) return 2;

    // Loose subsequence match, so "cv" finds "View CV" and "gh" finds "GitHub".
    var at = 0;
    for (var i = 0; i < query.length; i++) {
      at = haystack.indexOf(query[i], at);
      if (at === -1) return 0;
      at++;
    }
    return 1;
  }

  function render(query) {
    query = (query || "").trim().toLowerCase();

    matches = commands
      .map(function (command) { return { command: command, rank: score(command, query) }; })
      .filter(function (row) { return row.rank > 0; })
      .sort(function (a, b) { return b.rank - a.rank; })
      .map(function (row) { return row.command; });

    cursor = 0;
    list.textContent = "";

    matches.forEach(function (command, index) {
      var item = document.createElement("li");
      item.className = "palette__item";
      item.setAttribute("role", "option");
      item.id = "palette-opt-" + index;
      item.setAttribute("aria-selected", String(index === 0));

      var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "ico");
      icon.setAttribute("aria-hidden", "true");
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", command.icon);
      icon.appendChild(use);

      var label = document.createElement("span");
      label.textContent = command.label;

      var hint = document.createElement("small");
      hint.textContent = command.hint;

      item.append(icon, label, hint);

      item.addEventListener("click", function () { fire(index); });
      item.addEventListener("mousemove", function () { select(index); });

      list.appendChild(item);
    });

    noResults.hidden = matches.length > 0;
    syncActiveDescendant();
  }

  function select(index) {
    if (!matches.length) return;
    cursor = (index + matches.length) % matches.length;
    $$(".palette__item", list).forEach(function (item, i) {
      item.setAttribute("aria-selected", String(i === cursor));
      if (i === cursor) item.scrollIntoView({ block: "nearest" });
    });
    syncActiveDescendant();
  }

  function syncActiveDescendant() {
    if (matches.length) paletteIn.setAttribute("aria-activedescendant", "palette-opt-" + cursor);
    else paletteIn.removeAttribute("aria-activedescendant");
  }

  function fire(index) {
    var command = matches[typeof index === "number" ? index : cursor];
    if (!command) return;
    closePalette();
    command.run();
  }

  var lastFocused = null;

  function openPalette() {
    if (!palette.hidden) return;
    lastFocused = document.activeElement;
    palette.hidden = false;
    document.body.style.overflow = "hidden";
    paletteIn.value = "";
    render("");
    paletteIn.focus();
  }

  function closePalette() {
    if (palette.hidden) return;
    palette.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (palette && paletteIn && list) {
    openers.forEach(function (button) { button.addEventListener("click", openPalette); });

    $$("[data-close]", palette).forEach(function (el) {
      el.addEventListener("click", closePalette);
    });

    paletteIn.addEventListener("input", function () { render(paletteIn.value); });

    paletteIn.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowDown": event.preventDefault(); select(cursor + 1); break;
        case "ArrowUp":   event.preventDefault(); select(cursor - 1); break;
        case "Home":      event.preventDefault(); select(0); break;
        case "End":       event.preventDefault(); select(matches.length - 1); break;
        case "Enter":     event.preventDefault(); fire(); break;
        case "Escape":    event.preventDefault(); closePalette(); break;
      }
    });

    // Keep focus inside the dialog while it is open.
    palette.addEventListener("keydown", function (event) {
      if (event.key === "Tab") { event.preventDefault(); paletteIn.focus(); }
    });

    document.addEventListener("keydown", function (event) {
      var isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        palette.hidden ? openPalette() : closePalette();
        return;
      }

      if (event.key === "Escape" && !palette.hidden) closePalette();

      // "/" opens the palette, unless the user is already typing somewhere.
      if (event.key === "/" && palette.hidden) {
        var tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA" && !document.activeElement.isContentEditable) {
          event.preventDefault();
          openPalette();
        }
      }
    });
  }

  /* ------------------------------ Housekeeping ---------------------------- */

  // Show the right modifier key for the platform.
  var hint = $("#kbd-hint");
  if (hint && !/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    hint.textContent = "Ctrl K";
  }

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
