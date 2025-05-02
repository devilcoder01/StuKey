import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};


export { generateToken, verifyToken };
