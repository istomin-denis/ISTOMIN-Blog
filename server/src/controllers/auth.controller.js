import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "../utils/schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieName = () => process.env.COOKIE_NAME || "istomin_session";
const maxAge = () => Number(process.env.COOKIE_MAX_AGE_DAYS || 7) * 24 * 60 * 60 * 1000;

function setSessionCookie(res, userId) {
  const days = process.env.COOKIE_MAX_AGE_DAYS || 7;
  const token = jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, { expiresIn: `${days}d` });
  res.cookie(cookieName(), token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: maxAge(), path: "/"
  });
}
const publicUser = (user) => ({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt });

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({ username: data.username, email: data.email, passwordHash });
  setSessionCookie(res, user._id);
  res.status(201).json({ user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email }).select("+passwordHash");
  const valid = user && await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Incorrect email or password" });
  setSessionCookie(res, user._id);
  res.json({ user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }));

export const logout = (_req, res) => {
  res.clearCookie(cookieName(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/"
  });
  res.status(204).end();
};
