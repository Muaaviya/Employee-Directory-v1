import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database";
import { employeeSchema } from "../validators/employeeValidator";

// CREATE EMPLOYEE RECORD
export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = employeeSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      });
    }

    const { name, email, role } = validatedData.data;

    const result = await pool.query(
      `INSERT INTO employees (name, email, role)
             VALUES ($1, $2, $3)
             RETURNING *`,
      [name, email, role],
    );

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// FETCH ALL EMPLOYEES
export const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY created_at DESC",
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EMPLOYEE RECORDS
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const validatedData = employeeSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      });
    }

    const { name, email, role } = validatedData.data;

    const result = await pool.query(
      `UPDATE employees
             SET name = $1, email = $2, role = $3
             WHERE id = $4
             RETURNING *`,
      [name, email, role, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

//DELETE EMPLOYEE RECORDS
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
