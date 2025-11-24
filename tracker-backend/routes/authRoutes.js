// tracker-backend/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// Rotas públicas
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Rota protegida - só acessa se estiver logado
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "nome", "sobrenome", "email", "dataNascimento"],
    });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuário", error: err.message });
  }
});

export default router;
