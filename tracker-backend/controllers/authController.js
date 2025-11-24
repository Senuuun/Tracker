import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================
// REGISTRO DE USUÁRIO
// =========================
export const registerUser = async (req, res) => {
  try {
    const { nome, sobrenome, dataNascimento, email, senha } = req.body;

    if (!nome || !sobrenome || !dataNascimento || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(senha, 10);

    await User.create({
      nome,
      sobrenome,
      dataNascimento,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// =========================
// LOGIN DE USUÁRIO
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch)
      return res.status(400).json({ message: "Senha incorreta" });

    // 🔒 Gera token com expiração de 7 dias
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🔥 Retorna o usuário sem expor a senha
    const userData = {
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      dataNascimento: user.dataNascimento,
    };

    res.json({
      message: "Login bem-sucedido",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// =========================
// MIDDLEWARE PARA PROTEGER ROTAS
// =========================
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token inválido ou expirado" });

    req.userId = decoded.id; // salva o ID no req
    next();
  });
};
