import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";

// require this before any route that needs a logged-in user.
// It checks the token and sets req.userId to the logged-in user's id.
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not logged in" });

    try {
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default requireAuth;
