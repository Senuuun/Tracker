import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", authRoutes);
app.use("/api/lists", listRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
