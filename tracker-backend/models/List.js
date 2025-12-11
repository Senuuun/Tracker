import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";
import ListItem from "./ListItem.js"; // agora funciona sem loop

const List = sequelize.define("List", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

// RELACIONAMENTO COM USER
User.hasMany(List, { foreignKey: "userId", onDelete: "CASCADE" });
List.belongsTo(User, { foreignKey: "userId" });

// RELACIONAMENTO COM LISTITEM
List.hasMany(ListItem, { foreignKey: "listId", onDelete: "CASCADE" });
ListItem.belongsTo(List, { foreignKey: "listId" });

export default List;
