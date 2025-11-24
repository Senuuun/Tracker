import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco
  process.env.DB_USER, // Usuário
  String(process.env.DB_PASSWORD || ""), // Força a senha ser string
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // opcional, tira logs do Sequelize
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", error);
  }
})();

export default sequelize;
