(function () {
  "use strict";
  if (window.__trainerMateFreeSupportAssistant) return;
  window.__trainerMateFreeSupportAssistant = true;

  var supportEmail = "support@trainermate.xyz";
  var secretPattern = /(?:password|passcode|reset\s*code|api\s*key|private\s*key|card\s*(?:number|details)|cvv|security\s*code)\s*[:=]?\s*\S+|\b(?:sk|rk)-[A-Za-z0-9_-]{12,}\b|\bwhsec_[A-Za-z0-9_-]{12,}\b|\b(?:\d[ -]?){13,19}\b/i;
  var personalPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b(?:\+44\s?7\d{3}|07\d{3})\s?\d{3}\s?\d{3}\b|\b(?:trainer(?:mate)?|ndors)\s*(?:id)?\s*[:=]?\s*[A-Za-z0-9_-]+\b/i;
  var answers = [
    { words: ["price", "cost", "full", "pro", "upgrade"], text: "TrainerMate Full costs £5.00 per month. Open the Upgrade section in TrainerMate and use the secure Stripe checkout option. Stripe handles the card details." },
    { words: ["cancel", "cancellation", "billing", "card", "subscription"], text: "Open Upgrade in TrainerMate and choose Manage Stripe billing. Cancellation normally keeps Full active until the paid monthly period ends, then the account returns to Free." },
    { words: ["refund", "charged", "payment", "dispute"], text: "Payment disputes, duplicate charges and refunds need a person from TrainerMate Support. Please use the email support button below and do not include card details." },
    { words: ["password", "login", "log in", "sign in", "forgot"], text: "Use Forgot password on the TrainerMate sign-in screen. Never send your password or reset code in chat or email. If the reset does not arrive, contact TrainerMate Support." },
    { words: ["provider", "fobs", "portal", "save", "test login"], text: "Open Manage providers, enter the correct HTTPS FOBS address and login details, then choose Save and test login. TrainerMate should only confirm success after the login works and the saved record is verified." },
    { words: ["zoom", "connect", "meeting"], text: "Open the Zoom section in TrainerMate and choose Connect Zoom. Complete approval on Zoom's own website, then return to TrainerMate. TrainerMate should never ask for your Zoom password." },
    { words: ["course", "calendar", "sync", "diary"], text: "Check that the provider login is working, then run a sync from TrainerMate. Full accounts can look up to 12 weeks ahead; Free accounts have a smaller manual workflow." },
    { words: ["certificate", "document", "expiry", "upload"], text: "Use Certificates in TrainerMate to review expiry warnings and supported provider uploads. If an upload fails, check the provider login first and retry once." },
    { words: ["load", "loading", "retry", "offline", "internet"], text: "If TrainerMate says it could not load, keep the app open and choose Retry once. Check that Windows has internet access. If it repeats, use in-app Support so the diagnostic details can be checked safely." },
    { words: ["download", "install", "update", "version"], text: "Use the Download page on this website for the current installer. Close TrainerMate before installing an update, then reopen it after setup finishes." },
    { words: ["privacy", "secure", "security", "data"], text: "This website assistant runs entirely in your browser and sends no chat messages to TrainerMate or an AI service. Never type passwords, card details, reset codes or full TrainerMate IDs here." },
    { words: ["support", "human", "person", "help", "contact"], text: "For account-specific help, email support@trainermate.xyz or use the Support area inside TrainerMate. Do not send passwords, reset codes, provider credentials or payment-card details." }
  ];

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function bestAnswer(question) {
    var text = String(question || "").trim().toLowerCase();
    if (!text) return "Please type a TrainerMate support question.";
    if (secretPattern.test(text) || personalPattern.test(text)) return "Please remove private information before asking. Do not share passwords, reset codes, card details, provider credentials, email addresses, phone numbers or full TrainerMate IDs.";
    var best = null, bestScore = 0;
    answers.forEach(function (answer) {
      var score = answer.words.reduce(function (total, word) { return total + (text.indexOf(word) !== -1 ? (word.indexOf(" ") !== -1 ? 3 : 1) : 0); }, 0);
      if (score > bestScore) { best = answer; bestScore = score; }
    });
    return best && bestScore > 0 ? best.text : "I couldn't find a reliable answer for that. Please use human support so a person can check it properly. Do not include passwords, reset codes, card details or provider credentials.";
  }

  var launcher = element("button", "tm-support-launcher", "Ask TrainerMate Support");
  launcher.type = "button"; launcher.setAttribute("aria-expanded", "false"); launcher.setAttribute("aria-controls", "tm-support-panel");
  var panel = element("section", "tm-support-panel");
  panel.id = "tm-support-panel"; panel.setAttribute("aria-label", "TrainerMate Support Assistant"); panel.setAttribute("aria-hidden", "true");
  var head = element("header", "tm-support-head");
  head.appendChild(element("div", "tm-support-mark", "TM"));
  var heading = element("div"); heading.appendChild(element("div", "tm-support-title", "TrainerMate Support Assistant")); heading.appendChild(element("div", "tm-support-subtitle", "Free, private help for common questions"));
  var close = element("button", "tm-support-close", "×"); close.type = "button"; close.setAttribute("aria-label", "Close support assistant");
  head.appendChild(heading); head.appendChild(close);
  var messages = element("main", "tm-support-messages"); messages.setAttribute("aria-live", "polite");
  function addMessage(text, role) { var message = element("div", "tm-support-message tm-support-" + role, text); messages.appendChild(message); messages.scrollTop = messages.scrollHeight; return message; }
  var welcome = addMessage("Hi — I’m TrainerMate’s automated Support Assistant. I can help with setup, providers, Zoom, courses, Full and billing.", "assistant");
  welcome.appendChild(element("div", "tm-support-meta", "Your questions stay in this browser. Please don’t enter private information."));
  var choices = element("div", "tm-support-choices");
  ["Add a provider", "Reset my password", "Full pricing", "TrainerMate won't load"].forEach(function (label) { var choice = element("button", "tm-support-choice", label); choice.type = "button"; choice.addEventListener("click", function () { ask(label); }); choices.appendChild(choice); });
  messages.appendChild(choices);
  var compose = element("footer", "tm-support-compose"), form = element("form", "tm-support-row"), input = element("textarea", "tm-support-input"), send = element("button", "tm-support-send", "Send");
  input.maxLength = 600; input.rows = 2; input.placeholder = "Ask a TrainerMate question…"; input.setAttribute("aria-label", "Support question"); send.type = "submit";
  form.appendChild(input); form.appendChild(send); compose.appendChild(form);
  var privacy = element("div", "tm-support-privacy", "Automated answers can be limited. Don’t send passwords, codes, card details or full IDs. "), human = element("a", "tm-support-human", "Email human support");
  human.href = "mailto:" + supportEmail + "?subject=TrainerMate%20support"; privacy.appendChild(human); compose.appendChild(privacy);
  panel.appendChild(head); panel.appendChild(messages); panel.appendChild(compose); document.body.appendChild(panel); document.body.appendChild(launcher);

  function setOpen(open) { panel.setAttribute("aria-hidden", open ? "false" : "true"); launcher.setAttribute("aria-expanded", open ? "true" : "false"); launcher.textContent = open ? "Close support" : "Ask TrainerMate Support"; if (open) input.focus(); }
  function ask(value) { var question = String(value || "").trim(); if (!question) return; addMessage(question, "user"); input.value = ""; window.setTimeout(function () { addMessage(bestAnswer(question), "assistant"); }, 180); }
  launcher.addEventListener("click", function () { setOpen(panel.getAttribute("aria-hidden") === "true"); });
  close.addEventListener("click", function () { setOpen(false); launcher.focus(); });
  form.addEventListener("submit", function (event) { event.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", function (event) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input.value); } });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && panel.getAttribute("aria-hidden") === "false") setOpen(false); });
})();
