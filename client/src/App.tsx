import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { AxiosError } from "axios";

import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import DeleteDialog from "./components/DeleteDialog";

import { employeeService } from "./services/employeeService";
import type { Employee, EmployeeInput } from "./types/employee";

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchEmployees = async () => {
    try {
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch {
      setError("Unable to load employees. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query),
    );
  }, [employees, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize),
  );

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSave = async (data: EmployeeInput) => {
    try {
      setError("");

      if (selectedEmployee) {
        await employeeService.update(selectedEmployee.id, data);
      } else {
        await employeeService.create(data);
      }

      setShowForm(false);
      setSelectedEmployee(null);
      setCurrentPage(1);
      await fetchEmployees();
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Unable to save employee.");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");
      await employeeService.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchEmployees();
    } catch {
      setError("Unable to delete employee.");
    } finally {
      setDeleting(false);
    }
  };

  const openAddForm = () => {
    setError("");
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const openEditForm = (employee: Employee) => {
    setError("");
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    setError("");
  };

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Employee Directory home">
            <span className="brand-mark" aria-hidden="true">
              <Users size={18} strokeWidth={2.2} />
            </span>
            <span className="brand-name">PEOPLE<span> / </span>DIRECTORY</span>
          </a>
          <div className="workspace-label">
            <span className="workspace-dot" aria-hidden="true" />
            ADMIN WORKSPACE
          </div>
        </header>

        <section className="page-intro">
          <div>
            <p className="eyebrow">PEOPLE OPERATIONS</p>
            <h1>Employee directory</h1>
            <p className="intro-copy">
              The people behind everything. Keep your team details up to date.
            </p>
          </div>
          <button onClick={openAddForm} className="button-primary">
            <Plus size={18} strokeWidth={2.3} />
            Add employee
          </button>
        </section>

        <section className="stats-strip" aria-label="Directory statistics">
          <div className="stat-item">
            <span className="stat-value">{employees.length}</span>
            <span className="stat-label">Total employees</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-value">{filteredEmployees.length}</span>
            <span className="stat-label">Matching your search</span>
          </div>
          <div className="stats-note">
            <span className="status-indicator" aria-hidden="true" />
            Directory overview
          </div>
        </section>

        {error && !showForm && (
          <div role="alert" className="global-error">
            {error}
          </div>
        )}

        <section className="directory-panel" aria-labelledby="directory-title">
          <div className="panel-header">
            <div className="panel-heading">
              <h2 id="directory-title">All employees</h2>
              <p>Browse, search, and manage your team.</p>
            </div>
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employees"
                aria-label="Search employees by name, email, or role"
              />
              <span className="search-shortcut" aria-hidden="true">⌕</span>
            </label>
          </div>

          {loading ? (
            <div className="loading-state" role="status">
              <span className="loading-mark" aria-hidden="true" />
              Loading employees...
            </div>
          ) : (
            <EmployeeTable
              employees={paginatedEmployees}
              onEdit={openEditForm}
              onDelete={setDeleteTarget}
            />
          )}

          {!loading && filteredEmployees.length > 0 && (
            <div className="pagination">
              <p>
                Showing{" "}
                <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredEmployees.length)}</strong>
                {" "}of <strong>{filteredEmployees.length}</strong> employees
              </p>
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
                  disabled={currentPage === 1}
                  className="button-secondary"
                >
                  Previous
                </button>
                <span>Page <strong>{currentPage}</strong> of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="button-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {showForm && (
          <div className="modal-backdrop" onClick={closeForm}>
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="employee-form-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-heading">
                <p className="eyebrow">TEAM RECORD</p>
                <h2 id="employee-form-title">
                  {selectedEmployee ? "Edit employee" : "Add a teammate"}
                </h2>
              </div>
              {error && <div role="alert" className="global-error">{error}</div>}
              <EmployeeForm
                employee={selectedEmployee}
                onSubmit={handleSave}
                onCancel={closeForm}
              />
            </div>
          </div>
        )}

        <DeleteDialog
          employee={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />

        <footer className="app-footer">
          <span>EMPLOYEE DIRECTORY</span>
          <span>Built for better teams.</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
