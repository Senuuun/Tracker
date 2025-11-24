import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUserLists, createList } from "../controllers/listController.js";

const router = express.Router();

router.get("/", verifyToken, getUserLists);
router.post("/", verifyToken, createList);

export default router;
