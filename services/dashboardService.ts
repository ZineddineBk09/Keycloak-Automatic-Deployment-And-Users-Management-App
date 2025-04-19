
import axios from "axios";

const API_BASE_URL = "/api"; // Replace with your backend API base URL

export const fetchKeyMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`);
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/notifications`);
  return response.data;
};

export const fetchResourceUsage = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/resource-usage`);
  return response.data;
};