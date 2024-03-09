import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";

// isUser
export const requireSignIn = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).send({
      success: false,
      message: "JWT_Token must be provided!",
    });
  }
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// isAdmin

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access! User not authenticated.",
      });
    }
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access! User not found.",
      });
    }

    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Forbidden! User does not have admin privileges.!",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
