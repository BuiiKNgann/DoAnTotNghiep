import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Kiểm tra token

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token hoặc sai định dạng" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🧪 IN KIỂM TRA
    console.log("✅ Đang verify token với JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verify failed:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
// Phân quyền theo role
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Không có quyền truy cập" });
//     }
//     next();
//   };
// };
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};
