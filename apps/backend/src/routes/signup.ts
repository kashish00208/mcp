import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";  
import { Request, Response } from "express";
import { UserSchema } from "../validateSchema/signupSchema";


export async function SignUP(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.json({ message: "User created successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
