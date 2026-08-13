(function () {
  var siteVersion = "20260813-3";
  var storageKey = "trainermate-site-version";
  var loaderScript = document.currentScript;

  function loadSupportAssistant() {
    if (document.querySelector('script[data-trainermate-support]')) return;
    var assetBase = loaderScript && loaderScript.src ? new URL("./", loaderScript.src) : new URL("./assets/", document.baseURI);
    var stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("support-assistant.css?v=" + siteVersion, assetBase).toString();
    var assistant = document.createElement("script");
    assistant.src = new URL("support-assistant.js?v=" + siteVersion, assetBase).toString();
    assistant.defer = true;
    assistant.dataset.trainermateSupport = "true";
    document.head.appendChild(stylesheet);
    document.head.appendChild(assistant);
  }

  function refreshFor(version) {
    var url = new URL(window.location.href);
    if (url.searchParams.get("site") !== version) {
      url.searchParams.set("site", version);
      window.location.replace(url.toString());
    }
  }

  try {
    var previousVersion = window.localStorage.getItem(storageKey);
    window.localStorage.setItem(storageKey, siteVersion);

    if (previousVersion && previousVersion !== siteVersion) {
      refreshFor(siteVersion);
    }
  } catch (_) {
    // Browsers with storage disabled can still use the freshly versioned assets.
  }

  try {
    var versionUrl = new URL("./site-version.json", document.baseURI);
    versionUrl.searchParams.set("_", Date.now().toString());
    fetch(versionUrl.toString(), { cache: "no-store" })
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(function (release) {
        if (release && release.version && release.version !== siteVersion) {
          refreshFor(release.version);
        }
      })
      .catch(function () {
        // A temporary network issue should never get in the visitor's way.
      });
  } catch (_) {
    // Older browsers still benefit from the versioned assets above.
  }

  loadSupportAssistant();

  if (/\/download\.html$/i.test(window.location.pathname)) {
    var downloadHeading = Array.prototype.find.call(document.querySelectorAll("h2"), function (heading) {
      return /Current Windows release/i.test(heading.textContent || "");
    });
    var downloadCard = downloadHeading && downloadHeading.closest(".card");
    if (downloadCard && !document.getElementById("windows-publisher-explainer")) {
      var publisherNotice = Array.prototype.find.call(document.querySelectorAll("main .warning"), function (notice) {
        return /Unknown publisher/i.test(notice.textContent || "");
      }) || document.createElement("section");
      publisherNotice.id = "windows-publisher-explainer";
      publisherNotice.className = "warning";
      publisherNotice.style.marginBottom = "20px";
      publisherNotice.setAttribute("aria-labelledby", "publisher-warning-title");
      publisherNotice.innerHTML = "<h2 id='publisher-warning-title' style='margin:0 0 10px'>You may see a Windows security message</h2>" +
        "<p style='margin:0 0 10px'><b>Windows may say “Unknown publisher” when you install TrainerMate. This is expected with the current version.</b> It means Windows cannot yet display our business name on the installer; it is not a message saying that Windows found a virus.</p>" +
        "<p style='margin:0 0 10px'><b>The simple safety rule:</b> only install TrainerMate after using the blue <b>Download Windows installer</b> button on this official website. Do not install a copy sent as an email attachment or downloaded from another website.</p>" +
        "<p style='margin:0'>Keep your normal Windows security protection switched on. If you are unsure where the file came from, cancel and contact TrainerMate support.</p>";
      downloadCard.insertAdjacentElement("beforebegin", publisherNotice);
    }
    var technicalCheck = downloadCard && downloadCard.querySelector("a[href$='.sha256.txt']");
    if (technicalCheck) technicalCheck.textContent = "Optional technical file check";
  }

  // Keep the public pricing copy consistent with the authenticated Stripe
  // checkout without duplicating payment logic or collecting card details.
  if (/\/pricing\.html$/i.test(window.location.pathname)) {
    var proHeading = Array.prototype.find.call(document.querySelectorAll("h2"), function (heading) {
      return /TrainerMate Full/i.test(heading.textContent || "");
    });
    var proCard = proHeading && proHeading.closest(".card");
    if (proCard) {
      var price = proCard.querySelector(".price");
      if (price) price.innerHTML = "&pound;5 <span style='font-size:18px;letter-spacing:0'>one month</span>";
      var summary = price && price.nextElementSibling;
      if (summary && summary.classList.contains("small")) {
        summary.innerHTML = "Choose at secure checkout: a <b>&pound;5 one-month pass</b> with no renewal, <b>&pound;5 monthly</b>, or <b>&pound;40 yearly</b> (saving &pound;20 compared with 12 monthly payments).";
      }
      var subscribe = proCard.querySelector("a[href*='/billing/subscribe']");
      if (subscribe) {
        subscribe.textContent = "Choose a secure payment option";
        var terms = document.createElement("p");
        terms.className = "small";
        terms.style.marginTop = "14px";
        terms.textContent = "Recurring plans renew until cancelled. Cancel securely at any time: Pro stays active through the paid period, then automatically returns to Free. One-month passes never renew. Stripe handles payment details; TrainerMate never stores card numbers.";
        subscribe.insertAdjacentElement("afterend", terms);
      }
    }
  }

  if (/\/terms\.html$/i.test(window.location.pathname)) {
    Array.prototype.forEach.call(document.querySelectorAll("h2"), function (heading) {
      if (/^7\. Plans and subscriptions/i.test(heading.textContent || "")) {
        heading.textContent = "7. Plans, payments and subscriptions";
        if (heading.nextElementSibling) heading.nextElementSibling.textContent = "TrainerMate Free includes limited features. TrainerMate Full is available as a £5 one-month pass with no renewal, a £5 monthly subscription, or a £40 annual subscription. Recurring plans renew until cancelled. Cancellation stops the next renewal; access continues through the period already paid for and then automatically returns to Free. Cancellation does not itself refund the current paid period. Payments and refunds are processed securely by Stripe.";
      }
      if (/^9\. Updates/i.test(heading.textContent || "")) {
        if (heading.nextElementSibling) heading.nextElementSibling.textContent = "TrainerMate can show update notices and may download a staged automatic update when enabled by the administrator. Automatic installation is attempted only for an approved HTTPS installer whose SHA-256 checksum exactly matches the published release. Windows security and publisher prompts are not bypassed. Install updates only from official TrainerMate links.";
      }
    });
  }
})();
