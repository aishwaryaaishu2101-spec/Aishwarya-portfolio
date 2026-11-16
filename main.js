$(function () {
  var $html = $("html");

  /* ---------- Theme toggle (light / dark) ---------- */
  function updateThemeLabel() {
    var isDark = $html.hasClass("dark");
    $("#theme-toggle").attr("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
  updateThemeLabel();

  $("#theme-toggle").on("click", function () {
    $html.toggleClass("dark");
    try {
      localStorage.setItem("theme", $html.hasClass("dark") ? "dark" : "light");
    } catch (e) {
      /* storage unavailable: ignore */
    }
    updateThemeLabel();
  });

  /* ---------- Mobile menu ---------- */
  var $menuBtn = $("#menu-toggle");
  var $menu = $("#nav-mobile");

  function setMenu(open) {
    $menuBtn.toggleClass("is-open", open).attr("aria-expanded", open);
    if (open) {
      $menu.stop(true, true).slideDown(180);
    } else {
      $menu.stop(true, true).slideUp(180);
    }
  }

  $menuBtn.on("click", function () {
    setMenu(!$menuBtn.hasClass("is-open"));
  });

  // Close the menu after tapping a link
  $menu.find("a").on("click", function () {
    setMenu(false);
  });

  // If the window is resized to desktop width, reset the mobile menu
  $(window).on("resize", function () {
    if ($(window).width() >= 768) {
      $menu.hide();
      $menuBtn.removeClass("is-open").attr("aria-expanded", false);
    }
  });

  /* ---------- Fade-in on scroll + chart bar animation ---------- */
  var $targets = $(".reveal, .chart");

  function show($el) {
    if ($el.hasClass("reveal")) $el.addClass("is-visible");
    if ($el.hasClass("chart")) $el.addClass("in-view");
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        $.each(entries, function (_, entry) {
          if (entry.isIntersecting) {
            show($(entry.target));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    $targets.each(function () {
      observer.observe(this);
    });
  } else {
    // Very old browsers: just show everything
    $targets.each(function () {
      show($(this));
    });
  }
});
