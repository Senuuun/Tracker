import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ListItem = sequelize.define("ListItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  listId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mediaId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagem: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.STRING
  }
});

export default ListItem;
