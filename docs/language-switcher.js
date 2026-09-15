(function () {
  const siteOrigin = "https://liyuan199701.github.io";

  const languages = [
    { code: "en", label: "English" },
    { code: "zh-CN", label: "Chinese" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "pt", label: "Portuguese" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "ar", label: "Arabic" },
    { code: "hi", label: "Hindi" }
  ];

  function removeTranslateParams(url) {
    Array.from(url.searchParams.keys()).forEach((key) => {
      if (key.startsWith("_x_tr_")) {
        url.searchParams.delete(key);
      }
    });
    return url;
  }

  function originalUrlFromTranslateProxy(currentUrl) {
    if (currentUrl.hostname === "translate.google.com") {
      const sourceUrl = currentUrl.searchParams.get("u");
      if (!sourceUrl) {
        return "";
      }

      const unwrappedUrl = originalUrlFromTranslateProxy(new URL(sourceUrl));
      return unwrappedUrl || sourceUrl;
    }

    if (currentUrl.hostname.endsWith(".translate.goog")) {
      const originalUrl = new URL(currentUrl.pathname, siteOrigin);
      currentUrl.searchParams.forEach((value, key) => {
        if (!key.startsWith("_x_tr_")) {
          originalUrl.searchParams.append(key, value);
        }
      });
      originalUrl.hash = currentUrl.hash;
      return originalUrl.toString();
    }

    return "";
  }

  function currentPageUrl() {
    const translatedSourceUrl = originalUrlFromTranslateProxy(
      new URL(window.location.href)
    );

    if (translatedSourceUrl) {
      return translatedSourceUrl;
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    const sourceUrl = new URL(
      canonical && canonical.href ? canonical.href : window.location.href
    );
    return removeTranslateParams(sourceUrl).toString();
  }

  function currentLanguage() {
    const currentUrl = new URL(window.location.href);
    return (
      currentUrl.searchParams.get("tl") ||
      currentUrl.searchParams.get("_x_tr_tl") ||
      "en"
    );
  }

  function translateTo(languageCode) {
    if (!languageCode || languageCode === "en") {
      window.location.href = currentPageUrl();
      return;
    }

    const translateUrl = new URL("https://translate.google.com/translate");
    translateUrl.searchParams.set("sl", "en");
    translateUrl.searchParams.set("tl", languageCode);
    translateUrl.searchParams.set("u", currentPageUrl());
    window.location.href = translateUrl.toString();
  }

  function buildLanguageSwitcher() {
    if (document.getElementById("site-language-select")) {
      return;
    }

    const navRight =
      document.querySelector(".navbar .navbar-nav.navbar-nav-scroll.ms-auto") ||
      document.querySelector(".navbar .navbar-nav.ms-auto");

    if (!navRight) {
      return;
    }

    const item = document.createElement("li");
    item.className = "nav-item language-switcher-item";

    const label = document.createElement("label");
    label.className = "language-switcher";
    label.setAttribute("for", "site-language-select");

    const icon = document.createElement("i");
    icon.className = "bi bi-translate language-switcher-icon";
    icon.setAttribute("aria-hidden", "true");

    const select = document.createElement("select");
    select.id = "site-language-select";
    select.className = "language-switcher-select";
    select.setAttribute("aria-label", "Translate this page");

    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.label;
      select.appendChild(option);
    });

    select.value = currentLanguage();

    select.addEventListener("change", function (event) {
      translateTo(event.target.value);
    });

    label.appendChild(icon);
    label.appendChild(select);
    item.appendChild(label);
    navRight.insertBefore(item, navRight.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildLanguageSwitcher);
  } else {
    buildLanguageSwitcher();
  }
})();
