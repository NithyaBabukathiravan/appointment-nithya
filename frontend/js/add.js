const form = document.getElementById("appointmentForm");
const alertBox = document.getElementById("alertBox");

const fields = ["name", "email", "phone", "appointmentDate", "reason"];

function clearErrors() {
  fields.forEach((f) => {
    document.getElementById(f).style.borderColor = "#ccc";
    const err = document.getElementById(`${f}Error`);
    if (err) err.style.display = "none";
  });
  alertBox.style.display = "none";
}

function showFieldError(field, message) {
  const input = document.getElementById(field);
  const err = document.getElementById(`${field}Error`);
  input.style.borderColor = "#c0392b";
  if (err) {
    if (message) err.textContent = message;
    err.style.display = "block";
  }
}

function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = "block";
}

function validate(payload) {
  let valid = true;

  if (!payload.name.trim()) {
    showFieldError("name");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email.trim() || !emailPattern.test(payload.email)) {
    showFieldError("email");
    valid = false;
  }

  if (!payload.phone.trim()) {
    showFieldError("phone");
    valid = false;
  }

  if (!payload.appointmentDate) {
    showFieldError("appointmentDate");
    valid = false;
  }

  if (!payload.reason.trim()) {
    showFieldError("reason");
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    appointmentDate: document.getElementById("appointmentDate").value,
    reason: document.getElementById("reason").value,
  };

  if (!validate(payload)) {
    showAlert("Please fix the highlighted fields.");
    return;
  }

  try {
    await AppointmentAPI.create(payload);
    // Status is set to Pending automatically by the backend.
    window.location.href = "list.html";
  } catch (err) {
    showAlert(err.message || "Failed to save appointment. Is the backend running?");
  }
});
