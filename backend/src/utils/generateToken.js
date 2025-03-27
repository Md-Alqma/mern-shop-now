import jwt from "jsonwebtoken";
export const generateToken = (userId) => {
  return jwt.sign(
    { _id: userId }, // Pass user ID in payload object
    process.env.JWT_SECRET,
    {
      expiresIn: "30d", // Token expires in 30 days
    }
  );
};
