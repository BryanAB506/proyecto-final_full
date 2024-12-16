export const fetchUserData = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("http://127.0.0.1:8000/api/usuarioLog/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Pasamos el token como header
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const userData = await response.json();
  return userData;
};