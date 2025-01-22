
const SECRET_KEY =process.env.JWT_SECRET;
import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    // console.log("token", token );

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized: Invalid token' });
      }
      req.user = user;
      next();
    });
  }
  export default authenticateToken;
