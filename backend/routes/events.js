import express from "express";
import Event from "../models/Event.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const events = await Event.find({ user: req.user._id });
  res.json(events);
});

router.post("/", async (req, res) => {
  const { date, title } = req.body;
  // Replace existing event on same date (one event per day, matching current UX)
  const event = await Event.findOneAndUpdate(
    { user: req.user._id, date },
    { title },
    { upsert: true, new: true }
  );
  res.status(201).json(event);
});

router.delete("/:id", async (req, res) => {
  await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Deleted" });
});

export default router;