import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";

const List = sequelize.define("List", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.hasMany(List, { foreignKey: "userId", onDelete: "CASCADE" });
List.belongsTo(User, { foreignKey: "userId" });

export default List;