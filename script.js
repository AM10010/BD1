/* =========================================================
   INVITO — Birthday Invitation · Vanilla JS
   Sections: loader, confetti, navbar, content rendering,
   reveal, lightbox, countdown, ripple, RSVP
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var PARTY_DATE = new Date("2026-09-12T19:00:00");

  var GALLERY = [
    { src: "images/g1.jpg", alt: "Blowing out birthday candles" },
    { src: "images/g2.jpg", alt: "Friends laughing under colourful balloons" },
    { src: "images/g3.jpg", alt: "Pastel birthday cake with gold candles" },
    { src: "images/g5.jpg", alt: "Childhood photo with a party hat" },
    { src: "images/g6.jpg", alt: "Sparklers glowing at night" },
    { src: "images/g4.jpg", alt: "Gift boxes with satin ribbons" }
  ];

  var HIGHLIGHTS = [
    { ico: "🎈", title: "Cake Cutting", text: "Gather round at 8:30 PM for candles, wishes and the very first slice." },
    { ico: "🎁", title: "Games & Activities", text: "Garden games, a photo booth and a few surprises we can't spoil yet." },
    { ico: "🎵", title: "Music & Entertainment", text: "A live acoustic set followed by a DJ until the last dancer drops." },
    { ico: "🍕", title: "Food & Drinks", text: "Wood-fired pizza, a dessert table and a signature pink lemonade." },
    { ico: "🎂", title: "Special Moments", text: "Toasts from family and friends, plus a memory wall for your notes." },
    { ico: "✨", title: "Grand Finale", text: "Sparklers and a confetti send-off under the midnight sky." }
  ];

  var DRESS = [
    { ico: "🌈", title: "Colourful Party", text: "Bright and vibrant outfits — the louder the better.", colors: ["#ff7ea8", "#ffcf5c", "#6ed3c1"] },
    { ico: "🤍", title: "White Theme", text: "Elegant white outfits with soft golden details.", colors: ["#ffffff", "#f3ece2", "#e6b34a"] },
    { ico: "💙", title: "Blue Theme", text: "Blue-toned clothing, from powder to midnight.", colors: ["#cfe3ff", "#7bb8ff", "#2f4f8f"] }
  ];

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------- Page loader ---------- */
  document.body.classList.add("loading");
  window.addEventListener("load", function () {
    setTimeout(function () {
      var l = $("#loader");
      if (l) l.classList.add("hide");
      document.body.classList.remove("loading");
      burstConfetti(90);
    }, 700);
  });

  /* ---------- Confetti (canvas) ---------- */
  var canvas = $("#confetti");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var pieces = [];
  var COLORS = ["#ff7ea8", "#ff9f6e", "#e6b34a", "#6ed3c1", "#7bb8ff", "#ffffff"];

  function sizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function burstConfetti(count) {
    if (!ctx) return;
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        w: 5 + Math.random() * 7,
        h: 8 + Math.random() * 10,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        vy: 1.2 + Math.random() * 2.4,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * Math.PI,
        vr: -0.08 + Math.random() * 0.16
      });
    }
  }

  function drawConfetti() {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = pieces.length - 1; i >= 0; i--) {
        var p = pieces[i];
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        if (p.y > canvas.height + 30) pieces.splice(i, 1);
      }
    }
    requestAnimationFrame(drawConfetti);
  }
  drawConfetti();

  /* ---------- Navbar colour change on scroll ---------- */
  var nav = $("#nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Close mobile menu after clicking a link */
  $$(".site-nav .nav-link, .site-nav .btn").forEach(function (a) {
    a.addEventListener("click", function () {
      var open = $(".navbar-collapse.show");
      if (open && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(open).hide();
      }
    });
  });

  /* ---------- Render gallery ---------- */
  var grid = $("#galleryGrid");
  if (grid) {
    GALLERY.forEach(function (item, i) {
      var col = document.createElement("div");
      col.className = "col-6 col-lg-4 reveal";
      col.style.setProperty("--d", (i % 3) * 0.1 + "s");
      col.innerHTML =
        '<figure class="gal-item mb-0" data-index="' + i + '" tabindex="0" role="button" aria-label="Open photo">' +
        '<img src="' + item.src + '" alt="' + item.alt + '" width="900" height="900" loading="lazy" /></figure>';
      grid.appendChild(col);
    });
  }

  /* ---------- Render highlights ---------- */
  var hGrid = $("#highlightGrid");
  if (hGrid) {
    HIGHLIGHTS.forEach(function (h, i) {
      var col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 reveal";
      col.style.setProperty("--d", (i % 3) * 0.1 + "s");
      col.innerHTML =
        '<div class="glass-card h-100 lift"><span class="ico">' + h.ico + "</span>" +
        "<h3>" + h.title + "</h3><p>" + h.text + "</p></div>";
      hGrid.appendChild(col);
    });
  }

  /* ---------- Render dress code ---------- */
  var dGrid = $("#dressGrid");
  if (dGrid) {
    DRESS.forEach(function (d, i) {
      var swatches = d.colors.map(function (c) {
        return '<span class="swatch" style="background:' + c + '"></span>';
      }).join("");
      var col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 reveal";
      col.style.setProperty("--d", i * 0.1 + "s");
      col.innerHTML =
        '<div class="glass-card dress-card h-100 lift"><span class="ico">' + d.ico + "</span>" +
        "<h3>" + d.title + "</h3><p>" + d.text + "</p>" +
        '<div class="swatches">' + swatches + "</div></div>";
      dGrid.appendChild(col);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), current = 0;

  function openLb(i) {
    current = (i + GALLERY.length) % GALLERY.length;
    lbImg.src = GALLERY[current].src;
    lbImg.alt = GALLERY[current].alt;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }

  document.addEventListener("click", function (e) {
    var fig = e.target.closest ? e.target.closest(".gal-item") : null;
    if (fig) openLb(parseInt(fig.dataset.index, 10));
  });
  document.addEventListener("keydown", function (e) {
    var fig = document.activeElement && document.activeElement.classList.contains("gal-item");
    if (fig && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openLb(parseInt(document.activeElement.dataset.index, 10));
    }
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") openLb(current + 1);
    if (e.key === "ArrowLeft") openLb(current - 1);
  });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbNext").addEventListener("click", function () { openLb(current + 1); });
  $("#lbPrev").addEventListener("click", function () { openLb(current - 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  /* ---------- Countdown ---------- */
  var cd = {
    days: $("#cd-days"), hours: $("#cd-hours"), mins: $("#cd-mins"), secs: $("#cd-secs")
  };
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function setNum(el, val) {
    if (!el || el.textContent === val) return;
    el.textContent = val;
    el.classList.remove("tick-anim");
    void el.offsetWidth; /* restart animation */
    el.classList.add("tick-anim");
  }
  function tick() {
    var diff = PARTY_DATE - new Date();
    if (diff <= 0) {
      setNum(cd.days, "00"); setNum(cd.hours, "00"); setNum(cd.mins, "00"); setNum(cd.secs, "00");
      var note = $("#countNote");
      if (note) note.textContent = "The party has started — let's celebrate! 🎉";
      return;
    }
    var s = Math.floor(diff / 1000);
    setNum(cd.days, pad(Math.floor(s / 86400)));
    setNum(cd.hours, pad(Math.floor(s / 3600) % 24));
    setNum(cd.mins, pad(Math.floor(s / 60) % 60));
    setNum(cd.secs, pad(s % 60));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Button ripple ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".ripple") : null;
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height);
    var span = document.createElement("span");
    span.className = "rip";
    span.style.width = span.style.height = size + "px";
    span.style.left = e.clientX - r.left - size / 2 + "px";
    span.style.top = e.clientY - r.top - size / 2 + "px";
    btn.appendChild(span);
    setTimeout(function () { span.remove(); }, 600);
  });

  /* ---------- RSVP form ---------- */
  var form = $("#rsvpForm");
  if (form) {
    var group = $(".attend-group");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      $$("input[required], textarea[required]", form).forEach(function (input) {
        if (input.type === "radio") return;
        var ok = input.checkValidity();
        input.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      var attend = form.querySelector('input[name="attend"]:checked');
      group.classList.toggle("invalid", !attend);
      if (!attend) valid = false;

      if (!valid) return;

      var btn = $("#rsvpSubmit");
      btn.classList.add("loading");

      /* No backend: simulate a short send, then celebrate. */
      setTimeout(function () {
        btn.classList.remove("loading");
        form.hidden = true;
        var success = $("#rsvpSuccess");
        var name = $("#fullName").value.trim().split(" ")[0];
        $("#successMsg").textContent = attend.value === "yes"
          ? "Thanks " + name + "! Your RSVP is confirmed — we can't wait to celebrate with you 🎈"
          : "Thanks " + name + ", we'll miss you! Your message has been passed on with love 💌";
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        if (attend.value === "yes") burstConfetti(140);
      }, 900);
    });

    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("is-invalid") && e.target.checkValidity()) {
        e.target.classList.remove("is-invalid");
      }
    });
    form.addEventListener("change", function (e) {
      if (e.target.name === "attend") group.classList.remove("invalid");
    });

    $("#rsvpReset").addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      $("#rsvpSuccess").hidden = true;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- Footer year ---------- */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
