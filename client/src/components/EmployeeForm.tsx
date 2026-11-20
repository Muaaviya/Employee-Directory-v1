import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Employee, EmployeeInput } from "../types/employee";

interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: (data: EmployeeInput) => Promise<void>;
  onCancel: () => void;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeInput>({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      role: employee?.role ?? "",
    });
  }, [employee]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-fields">
      <div className="form-field">
        <label htmlFor="employee-name">Full name</label>
        <input
          id="employee-name"
          required
          minLength={2}
          maxLength={100}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Ahmed Khan"
        />
      </div>

      <div className="form-field">
        <label htmlFor="employee-email">Email address</label>
        <input
          id="employee-email"
          required
          type="email"
          maxLength={255}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="ahmed@example.com"
        />
      </div>

      <div className="form-field">
        <label htmlFor="employee-role">Role</label>
        <input
          id="employee-role"
          required
          minLength={2}
          maxLength={100}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="e.g. Software Engineer"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="button-primary"
        >
          {loading
            ? "Saving..."
            : employee
              ? "Update employee"
              : "Add employee"}
        </button>
      </div>
    </form>
  );
}
