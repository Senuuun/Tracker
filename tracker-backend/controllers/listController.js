import List from "../models/List.js";

export const getUserLists = async (req, res) => {
  try {
    const lists = await List.findAll({ where: { userId: req.userId } });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: "Erro ao carregar listas", error: err.message });
  }
};

export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "O nome da lista é obrigatório" });

    const newList = await List.create({
      title,
      userId: req.userId,
    });

    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar lista", error: err.message });
  }
};

// Cria listas padrão ao registrar usuário (pode ser usado depois)
export const createDefaultLists = async (userId) => {
  await List.bulkCreate([
    { title: "Series Watched", userId },
    { title: "Series I Want to See", userId },
  ]);
};