import List from "../models/List.js";
import ListItem from "../models/ListItem.js";

export const getUserLists = async (req, res) => {
  try {
    const lists = await List.findAll({ where: { userId: req.userId } });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: "Erro ao carregar listas" });
  }
};

export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Nome obrigatório" });

    const newList = await List.create({
      title,
      userId: req.userId,
    });

    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar lista" });
  }
};

/* 🗑️ REMOVE ITEM DA LISTA */
export const removeItemFromList = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ListItem.findByPk(itemId);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    await item.destroy();
    res.json({ message: "Item removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover item:", error);
    res.status(500).json({ error: "Erro ao remover item" });
  }
};
