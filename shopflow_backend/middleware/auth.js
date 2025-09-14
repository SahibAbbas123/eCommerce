// middleware/auth.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    return res.status(500).json({ error: "Server misconfiguration" });

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    // payload contains { userId, role }
    req.user = payload;
    next();
  });
}

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   console.error('JWT_SECRET missing');
//   return res.status(500).json({ error: 'Server misconfiguration' });
// }

// const token = jwt.sign(
//   { sub: user.id, role: user.role }, // use sub for subject
//   JWT_SECRET,
//   { expiresIn: '7d', issuer: 'shopflow' }
// );

export function authorizeAdmin(req, res, next) {
  const role = (req.user?.role || "").toString().toUpperCase(); // accept any case
  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
