import { Router } from "express";
import { Lesson, Chapter } from "../models";
import { Error } from "mongoose";

const router = Router();

// Index all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail Lesson
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(400).json({ message: "Lesson does not exist" });
    }
    const chapters = await Chapter.find({ lesson_id: req.params.id });
    const { name, _id, description, languages, creator, comments } = lesson;
    res
      .status(200)
      .json({ chapters, name, _id, description, languages, creator, comments });
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Create Lesson
router.post("/", async (req, res) => {
  try {
    if (!req.currentUser) {
      res
        .status(400)
        .json({ message: "You must be logged in to create a lesson" });
      return;
    }
    const lesson = new Lesson({
      ...req.body,
      creator: req.currentUser._id,
    });
    await lesson.save();
    res.json(lesson).status(200);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      res.json({ message: "Required fields were not filled" }).status(400);
      return;
    }
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Update Lesson
router.patch("/:id", async (req, res) => {
  try {
    if (!req.currentUser) {
      return res
        .status(400)
        .json({ message: "You must be logged in to update a lesson" });
    }
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson)
      return res.status(400).json({ message: "Lesson does not exist" });

    if (!req.currentUser._id.equals(lesson.creator)) {
      console.log(req.currentUser._id, lesson.creator);
      return res.status(400).json({ message: "You cannot update this lesson" });
    }
    for (let key in req.body) lesson.set(key, req.body[key]);
    await lesson.save();
    res.json(lesson).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a lesson
router.delete("/:id", async (req, res) => {
  try {
    if (!req.currentUser) {
      return res
        .status(400)
        .json({ message: "You must be logged in to delete a lesson" });
    }
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson)
      return res.status(400).json({ message: "Lesson does not exist" });

    if (!req.currentUser._id.equals(lesson.creator)) {
      console.log(req.currentUser._id, lesson.creator);
      return res.status(400).json({ message: "You cannot delete this lesson" });
    }

    await lesson.deleteChapters()
    await lesson.delete();
    res.json({message: "Lesson deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;
