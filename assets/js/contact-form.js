(() => {
  const form = document.getElementById("request-form");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const statusNode = form.querySelector("[data-form-status]");
  const contactEmail = "info@skvoz.tech";
  const successUrl = "thanks.html";

  function setStatus(message, isError = false) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.classList.toggle("is-error", isError);
  }

  function buildFallbackMailUrl(formData) {
    const organization = String(formData.get("Организация") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [
      `Организация: ${organization || "—"}`,
      `Электронная почта: ${email || "—"}`,
      "",
      message
    ].join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent("Запрос с сайта СКВОЗЬ")}&body=${encodeURIComponent(body)}`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const initialButtonText = submitButton?.textContent || "";
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Отправляем…";
    }

    setStatus("Отправляем запрос…");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData,
        signal: controller.signal
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || `Web3Forms returned ${response.status}`);
      }

      setStatus("Запрос отправлен. Открываем страницу подтверждения…");
      window.location.assign(successUrl);
    } catch (_error) {
      setStatus(
        "Не удалось отправить форму автоматически. Открываем письмо для отправки вручную.",
        true
      );
      window.location.href = buildFallbackMailUrl(formData);
    } finally {
      window.clearTimeout(timeoutId);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = initialButtonText;
      }
    }
  });
})();
