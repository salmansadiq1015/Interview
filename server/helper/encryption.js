import bcrypt from "bcrypt";
import crypto from "crypto";

// Hashing Password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare Password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate Reset password link
export const createRandomToken = async () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  crypto.createHash("sha256").update(resetToken).digest("hex");

  return resetToken;
};
