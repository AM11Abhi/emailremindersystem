import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface ReminderData {
  email: string;
  task: string;
  date: string;
  time: string;
  status?: 'Pending' | 'Sent';
}
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
const reminderApi = {
  create: async (data: ReminderData) => {
    try {
      const response = await axios.post(`${API_URL}/reminders`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create reminder:', error.response?.data || error.message);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/reminders`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch reminders:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/reminders/${id}`);
    } catch (error: any) {
      console.error('Failed to delete reminder:', error.response?.data || error.message);
      throw error;
    }
  },
  update: async (id: string, data: Partial<ReminderData>) => {
  const response = await axios.patch(`${API_URL}/reminders/${id}`, data);
  return response.data;
  }

};

export default reminderApi;