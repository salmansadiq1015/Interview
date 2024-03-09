import bcrypt from "bcrypt";

// Hashed Password
export const handPassword = async (password) => {
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

// Conpare Password
export const comparePassword = async (password, handedPassword) => {
  return await bcrypt.compare(password, handedPassword);
};
