(function () {
  var siteVersion = "20260602-1";
  var storageKey = "trainermate-site-version";

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
})();
