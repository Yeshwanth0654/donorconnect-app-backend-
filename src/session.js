export function getCurrentUser() {
  return {
    role: localStorage.getItem("role") || "",
    email: localStorage.getItem("userEmail") || "",
    name: localStorage.getItem("userName") || "",
  };
}

export function clearSession() {
  localStorage.clear();
}
