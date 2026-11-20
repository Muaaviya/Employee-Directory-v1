export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  role: string;
}

export interface UpdateEmployeeInput {
  name: string;
  email: string;
  role: string;
}
