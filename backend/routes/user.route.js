import express from "express";
import {
    createUser,
    getAllUsers,
    removeUser,
    updateUser
} from "../controllers/user.controller.js"
const router = express.Router();


router.post("/", createUser);
router.get("/", getAllUsers);
router.delete("/:id", removeUser);
router.put("/:id", updateUser);

export default router;