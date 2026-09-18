const tableBody = document.getElementById("appointmentTableBody");
const alertBox = document.getElementById("alertBox");

const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");

function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = "block";
  setTimeout(() => (alertBox.style.display = "none"), 4000);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

async function loadAppointments() {
  tableBody.innerHTML = `<tr class="empty-row"><td colspan="7">Loading...</td></tr>`;
  try {
    const appointments = await AppointmentAPI.getAll();
    renderTable(appointments);
  } catch (err) {
    tableBody.innerHTML = `<tr class="empty-row"><td colspan="7">Could not load appointments. Is the backend running?</td></tr>`;
    showAlert(err.message || "Failed to load appointments.");
  }
}

function renderTable(appointments) {
  if (!appointments || appointments.length === 0) {
    tableBody.innerHTML = `<tr class="empty-row"><td colspan="7">No appointments found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  appointments.forEach((appt) => {
    const isConfirmed = appt.status === "CONFIRMED";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(appt.name)}</td>
      <td>${escapeHtml(appt.email)}</td>
      <td>${escapeHtml(appt.phone)}</td>
      <td>${formatDate(appt.appointmentDate)}</td>
      <td>${escapeHtml(appt.reason)}</td>
      <td><span class="status-badge ${isConfirmed ? "status-confirmed" : "status-pending"}">${appt.status}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn-edit" data-id="${appt.id}">Edit</button>
          <button class="btn-delete" data-id="${appt.id}">Delete</button>
          <button class="btn-status ${isConfirmed ? "confirmed" : ""}" data-id="${appt.id}" data-current="${appt.status}">
            ${isConfirmed ? "Mark Pending" : "Mark Confirmed"}
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  attachRowListeners(appointments);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function attachRowListeners(appointments) {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id, appointments));
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => openDeleteModal(btn.dataset.id));
  });

  document.querySelectorAll(".btn-status").forEach((btn) => {
    btn.addEventListener("click", () => toggleStatus(btn.dataset.id, btn.dataset.current));
  });
}

// ---------- Edit ----------
function openEditModal(id, appointments) {
  const appt = appointments.find((a) => String(a.id) === String(id));
  if (!appt) return;

  document.getElementById("editId").value = appt.id;
  document.getElementById("editName").value = appt.name;
  document.getElementById("editEmail").value = appt.email;
  document.getElementById("editPhone").value = appt.phone;
  document.getElementById("editAppointmentDate").value = appt.appointmentDate;
  document.getElementById("editReason").value = appt.reason;

  editModal.classList.add("active");
}

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  editModal.classList.remove("active");
});

document.getElementById("updateBtn").addEventListener("click", async () => {
  const id = document.getElementById("editId").value;
  const payload = {
    name: document.getElementById("editName").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    appointmentDate: document.getElementById("editAppointmentDate").value,
    reason: document.getElementById("editReason").value.trim(),
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.appointmentDate || !payload.reason) {
    showAlert("All fields are required to update the appointment.");
    return;
  }

  try {
    await AppointmentAPI.update(id, payload);
    editModal.classList.remove("active");
    showAlert("Appointment updated successfully.", "success");
    loadAppointments();
  } catch (err) {
    showAlert(err.message || "Failed to update appointment.");
  }
});

// ---------- Delete ----------
function openDeleteModal(id) {
  document.getElementById("deleteId").value = id;
  deleteModal.classList.add("active");
}

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
  deleteModal.classList.remove("active");
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  const id = document.getElementById("deleteId").value;
  try {
    await AppointmentAPI.remove(id);
    deleteModal.classList.remove("active");
    showAlert("Appointment deleted.", "success");
    loadAppointments();
  } catch (err) {
    showAlert(err.message || "Failed to delete appointment.");
  }
});

// ---------- Status toggle ----------
async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === "CONFIRMED" ? "PENDING" : "CONFIRMED";
  try {
    await AppointmentAPI.updateStatus(id, newStatus);
    loadAppointments();
  } catch (err) {
    showAlert(err.message || "Failed to update status.");
  }
}

loadAppointments();
