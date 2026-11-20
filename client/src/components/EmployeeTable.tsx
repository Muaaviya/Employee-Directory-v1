import { Pencil, Trash2, Users } from "lucide-react";
import type { Employee } from "../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <Users className="empty-state-icon" size={34} />
        <p className="empty-state-title">No employees found</p>
        <p className="empty-state-copy">
          Add an employee or try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="employee-table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Role</th>
            <th className="actions-cell">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-identity">
                  <span className="employee-avatar" aria-hidden="true">
                    {employee.name.trim().charAt(0).toUpperCase()}
                  </span>
                  {employee.name}
                </div>
              </td>

              <td>{employee.email}</td>

              <td>
                <span className="role-badge">{employee.role}</span>
              </td>

              <td className="actions-cell">
                <div className="row-actions">
                  <button
                    onClick={() => onEdit(employee)}
                    aria-label={`Edit ${employee.name}`}
                    className="icon-button"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(employee)}
                    aria-label={`Delete ${employee.name}`}
                    className="icon-button icon-button-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
