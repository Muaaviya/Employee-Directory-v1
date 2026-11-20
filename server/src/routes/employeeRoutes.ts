import { Router } from "express";

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";

const router = Router();

// GET /api/employees
router.get("/", getEmployees);

// POST /api/employees
router.post("/", createEmployee);

// PUT /api/employees/:id
router.put("/:id", updateEmployee);

// DELETE /api/employees/:id
router.delete("/:id", deleteEmployee);

export default router;
