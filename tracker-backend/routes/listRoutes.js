import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import List from "../models/List.js";
import ListItem from "../models/ListItem.js";
import { removeItemFromList } from "../controllers/listController.js";

const router = express.Router();

/* 🟦 GET /api/lists → Listas + itens */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    let lists = await List.findAll({
      where: { userId },
      include: [{ model: ListItem }],
      order: [["createdAt", "ASC"]],
    });

    if (lists.length === 0) {
      await List.bulkCreate([
        { title: "Assistindo", userId },
        { title: "Planejo ver", userId },
        { title: "Completo", userId },
      ]);

      lists = await List.findAll({
        where: { userId },
        include: [{ model: ListItem }],
        order: [["createdAt", "ASC"]],
      });
    }

    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar listas." });
  }
});

/* 🟩 POST /api/lists → Criar lista */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: "Nome obrigatório." });

    const newList = await List.create({
      title: title.trim(),
      userId: req.userId,
    });

    res.status(201).json(newList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar lista." });
  }
});

/* 🟨 PUT /api/lists/:id → Editar lista */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const list = await List.findOne({ where: { id, userId: req.userId } });

    if (!list) return res.status(404).json({ message: "Lista não encontrada." });
    if (!title?.trim())
      return res.status(400).json({ message: "Nome obrigatório." });

    list.title = title.trim();
    await list.save();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao editar lista." });
  }
});

/* 🟥 DELETE /api/lists/:id → Excluir lista */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!list) return res.status(404).json({ message: "Lista não encontrada." });

    await list.destroy();
    res.json({ message: "Lista excluída." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir lista." });
  }
});

/* 🟦 GET /api/lists/:id → Detalhes */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const list = await List.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [{ model: ListItem }],
    });

    if (!list) return res.status(404).json({ message: "Lista não encontrada." });

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar lista." });
  }
});

/* 🟢 POST /api/lists/:listId/add → Adicionar item */
router.post("/:listId/add", verifyToken, async (req, res) => {
  try {
    const { listId } = req.params;
    const { mediaId, titulo, imagem, tipo } = req.body;

    const list = await List.findOne({
      where: { id: listId, userId: req.userId },
    });

    if (!list)
      return res.status(403).json({ message: "Lista não pertence ao usuário." });

    const exists = await ListItem.findOne({ where: { listId, mediaId } });
    if (exists)
      return res.status(409).json({ message: "Esse item já está nessa lista!" });

    const item = await ListItem.create({
      listId,
      mediaId,
      titulo,
      imagem,
      tipo,
    });

    res.json({ message: "Item adicionado!", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar item." });
  }
});

/* 🔻 NOVA ROTA - REMOVER ITEM DA LISTA */
router.delete("/item/:itemId", verifyToken, removeItemFromList);

export default router;
