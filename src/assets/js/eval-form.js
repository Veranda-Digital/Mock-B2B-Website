// Evaluation Kit form. With a form endpoint configured (site.evaluationForm.action)
// the browser submits normally. Until then, the request opens the visitor's email
// app, addressed to us and pre-filled, so no request is lost.
export function initEvalForm(form) {
  if (form.getAttribute("action")) return;

  const status = form.querySelector("[data-eval-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [...form.querySelectorAll(".form-field")].map((field) => {
      const label = field.querySelector("label").textContent.trim();
      const value = String(data.get(field.querySelector("[name]").name) || "").trim();
      return `${label}\n${value || "-"}`;
    });
    const company = String(data.get("company") || "").trim();
    const subject = `Evaluation Kit request${company ? `: ${company}` : ""}`;
    const body = lines.join("\n\n");

    window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) {
      status.hidden = false;
      status.textContent = `Your email app should open with your request ready to send. If it doesn't, email us at ${form.dataset.mailto}.`;
    }
  });
}
