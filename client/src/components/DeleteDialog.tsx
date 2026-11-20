import type { Employee } from "../types/employee";

interface DeleteDialogProps {
  employee: Employee | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteDialog({
  employee,
  onConfirm,
  onCancel,
  loading,
}: DeleteDialogProps) {
  if (!employee) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
        <h2 id="delete-dialog-title">
          Delete employee?
        </h2>

        <p>
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          action cannot be undone.
        </p>

        <div className="dialog-actions">
          <button
            onClick={onCancel}
            disabled={loading}
            className="button-secondary"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="button-danger"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
