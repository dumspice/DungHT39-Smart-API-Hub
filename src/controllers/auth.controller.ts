import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await (prisma as any).users.create({
      data: { email, password: hashedPassword, role: role || "user" },
    });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
