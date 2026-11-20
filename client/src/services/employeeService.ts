import axios from "axios";
import type { Employee, EmployeeInput } from "../types/employee";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await API.get("/employees");
    return response.data.data;
  },

  create: async (employee: EmployeeInput): Promise<Employee> => {
    const response = await API.post("/employees", employee);
    return response.data.data;
  },

  update: async (id: number, employee: EmployeeInput): Promise<Employee> => {
    const response = await API.put(`/employees/${id}`, employee);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await API.delete(`/employees/${id}`);
  },
};
