import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = async (formData) => {
  try {
    const response = await api.post("/api/loginPage/login/admins", {
      username: formData.username,
      password: formData.password,
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return error;
  }
};

export const signup = async (formData) => {
  try {
    const response = await api.post("/api/loginPage/signup/admins", {
      username: formData.username,
      password: formData.password,
    });
    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    return error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/loginPage/logout");
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    return error;
  }
}

export const verify = async () => {
  try {
    const response = await api.get("/auth/verify");
    return response;
  } catch (error) {
    console.error("Verification failed:", error);
    return error;
  }
}

