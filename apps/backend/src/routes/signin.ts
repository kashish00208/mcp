import bcrypt from "bcryptjs";

import { Response, Request } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

export default async function SignIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json("Email does not exist. Try signing up.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Sign in successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
