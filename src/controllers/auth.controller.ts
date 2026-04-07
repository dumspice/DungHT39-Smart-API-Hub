import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Dynamic access to 'users' table
  const user = await (prisma as any).users.findFirst({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const isExist = await (prisma as any).users.findFirst({
    where: { email },
  });

  if (isExist) {
    return res.status(400).json({ message: "User is already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await (prisma as any).users.create({
    data: { email, password: hashedPassword, role: role || "user" },
  });
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});
