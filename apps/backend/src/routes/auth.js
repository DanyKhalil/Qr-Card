import { Router } from "express";
const router = Router();

router.post("/login", (req, res) => {
  res.json({ success: true, message: "Login endpoint" });
});

router.post("/signup", (req, res) => {
  res.json({ success: true, message: "Signup endpoint" });
});

export default router;
