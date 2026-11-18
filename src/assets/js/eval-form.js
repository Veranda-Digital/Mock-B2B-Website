// Evaluation Kit form. With an endpoint configured (site.evaluationForm.action,
// currently Web3Forms) the request is submitted in the background and the result is
// shown inline. If JavaScript fails, the browser falls back to a normal form POST.
// With no endpoint configured, the request opens the visitor's email app instead,
// addressed to us and pre-filled, so no request is lost.
export function initEvalForm(form) {
  const status = form.querySelector("[data-eval-status]");
  const endpoint = form.getAttribute("action");

  const showStatus = (message, isError = false) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.classList.toggle("eval-form__status--error", isError);
  };

  if (endpoint) {
    const submitButton = form.querySelector('button[type="submit"]');
    const label = submitButton?.querySelector(".btn__label");
    const originalLabel = label?.textContent;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitButton?.disabled) return;

      if (submitButton) submitButton.disabled = true;
      if (label) label.textContent = "Sending...";
      if (status) status.hidden = true;

      try {
        const response = await fetch(endpoint, {
          method: form.method || "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success !== false) {
          form.reset();
          showStatus("Thanks! Your request is in. We'll be in touch soon to confirm details and arrange your kit.");
        } else {
          throw new Error(result.message || "Request failed");
        }
      } catch {
        showStatus(
          `Something went wrong sending your request. Please try again, or email us at ${form.dataset.mailto}.`,
          true,
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (label && originalLabel) label.textContent = originalLabel;
      }
    });
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [...form.querySelectorAll(".form-field")].map((field) => {
      const fieldLabel = field.querySelector("label").textContent.trim();
      const value = String(data.get(field.querySelector("[name]").name) || "").trim();
      return `${fieldLabel}\n${value || "-"}`;
    });
    const company = String(data.get("company") || "").trim();
    const subject = `Evaluation Kit request${company ? `: ${company}` : ""}`;
    const body = lines.join("\n\n");

    window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showStatus(`Your email app should open with your request ready to send. If it doesn't, email us at ${form.dataset.mailto}.`);
  });
}
