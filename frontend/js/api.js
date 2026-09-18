// Base URL of the Spring Boot backend.
// If you deploy the backend elsewhere, change this one line.
const API_BASE = "http://localhost:8080/api/appointments";

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // 204 No Content (DELETE) has no body
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || (data.fieldErrors && JSON.stringify(data.fieldErrors)))) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

const AppointmentAPI = {
  getAll: () => apiRequest("", { method: "GET" }),
  getOne: (id) => apiRequest(`/${id}`, { method: "GET" }),
  create: (payload) =>
    apiRequest("", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiRequest(`/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => apiRequest(`/${id}`, { method: "DELETE" }),
  updateStatus: (id, status) =>
    apiRequest(`/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
