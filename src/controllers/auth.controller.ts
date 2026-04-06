import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { registerSchema, loginSchema } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: formatZodError(parsed.error),
      });
    }

    const { email, password } = parsed.data;
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
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: formatZodError(parsed.error),
      });
    }

    const { email, password, role } = parsed.data;

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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const formatZodError = (error: any) => {
  const formatted = error.format();

  const result: Record<string, string> = {};

  for (const key in formatted) {
    if (key !== "_errors") {
      result[key] = formatted[key]?._errors?.[0];
    }
  }

  return result;
};
