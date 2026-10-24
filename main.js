(function () {
  const cfg = window.SITE_CONFIG || {};
  const wa = (cfg.whatsappE164 || "0000000000").replace(/\D/g, "");

  function decodeContactEmail(config) {
    function fromCodes(codes) {
      if (!codes || !codes.length) return "";
      return String.fromCharCode.apply(null, codes);
    }
    const user = fromCodes(config.mailUserCodes);
    const host = fromCodes(config.mailHostCodes);
    if (!user || !host) return "";
    return user + "@" + host;
  }

  const email = decodeContactEmail(cfg);

  function sanitizeSource(raw) {
    if (!raw || typeof raw !== "string") return "";
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    return cleaned.slice(0, 48);
  }

  function getLeadSource() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl =
      sanitizeSource(params.get("src")) || sanitizeSource(params.get("utm_source"));
    if (fromUrl) return fromUrl;
    return sanitizeSource(cfg.defaultSource) || "website";
  }

  const leadSource = getLeadSource();
  const viaLabel = "via:" + leadSource;

  function buildWhatsAppText(context) {
    const lines = [
      "Hi! I'm interested in your UV / UV-DTF sticker printers (equipment).",
      "Context: " + (context || "printer inquiry"),
      viaLabel,
    ];
    return lines.join("\n");
  }

  function waHref(context) {
    const text = encodeURIComponent(buildWhatsAppText(context));
    return "https://wa.me/" + wa + "?text=" + text;
  }

  const waLinks = [
    { id: "navWhatsApp", context: "nav" },
    { id: "heroWhatsApp", context: "hero" },
    { id: "modelsWhatsApp", context: "printer models quote" },
    { id: "contactWhatsApp", context: "contact footer" },
  ];
  waLinks.forEach(function (item) {
    const el = document.getElementById(item.id);
    if (el) el.href = waHref(item.context);
  });

  document.querySelectorAll("[data-wa-context]").forEach(function (el) {
    const ctx = el.getAttribute("data-wa-context") || "printer inquiry";
    el.href = waHref(ctx);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  const mail = document.getElementById("contactEmail");
  if (mail) {
    const subject = "Inquiry — UV Sticker Printers (" + viaLabel + ")";
    const body =
      "Hello,\n\nI'd like a quote on UV / UV-DTF sticker printer equipment.\n\n" +
      viaLabel +
      "\n";
    if (email) {
      mail.href =
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    }
    mail.textContent = "Email us";
  }

  const sourceNote = document.getElementById("sourceNote");
  if (sourceNote) sourceNote.textContent = "Lead tag on WhatsApp & email: " + viaLabel;

  if (cfg.brand) {
    const b = document.getElementById("brandName");
    if (b) b.textContent = cfg.brand;
  }
  if (cfg.factoryTag) {
    const t = document.getElementById("factoryTag");
    if (t) t.textContent = cfg.factoryTag;
  }

  const form = document.getElementById("inquiryForm");
  const success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const body = [
        "B2B inquiry — UV Sticker Printers (equipment)",
        viaLabel,
        "Name: " + (data.get("name") || ""),
        "Contact: " + (data.get("contact") || ""),
        "Interest: " + (data.get("interest") || ""),
        "Qty: " + (data.get("qty") || ""),
        "Country: " + (data.get("country") || ""),
        "Notes: " + (data.get("notes") || ""),
      ].join("\n");
      const mailto =
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent("B2B printer inquiry (" + viaLabel + ")") +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = mailto;
      if (success) success.classList.add("show");
    });
  }
})();
