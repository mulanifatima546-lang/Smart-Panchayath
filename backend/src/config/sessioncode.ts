import jwt from "jsonwebtoken";

const generateSessionCode = (userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
    return token;
}

export default generateSessionCode;