import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect); // all routes require auth

router.get("/", async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const task = await Task.create({ user: req.user._id, text: req.body.text });
  res.status(201).json(task);
});

router.patch("/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { done: req.body.done },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Deleted" });
});

export default router;