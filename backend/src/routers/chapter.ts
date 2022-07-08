import { Router } from "express";
import { Chapter, Lesson } from "../models";
import { Error } from "mongoose";

const router = Router();

// Index Chapters
router.get("/", async (req, res) => {
  try {
    const chapters = await Chapter.find();
    res.json(chapters).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Create Chapter
router.post("/:lesson_id", async (req, res) => {
  try {
    if (!req.currentUser) {
      res
        .status(400)
        .json({ message: "You must be logged in to create a chapter" });
      return;
    }

    const lesson = await Lesson.findById(req.params.lesson_id);

    if (!req.currentUser._id.equals(lesson.creator)) {
      console.log(req.currentUser._id, lesson.creator);
      return res
        .status(400)
        .json({ message: "You cannot create this chapter" });
    }

    const chapterCount = await Chapter.countDocuments({
      lesson_id: req.params.lesson_id,
    });

    const chapter = new Chapter({
      ...req.body,
      name: req.body.name ? req.body.name : `Chapter ${chapterCount + 1}`,
      index: chapterCount,
      lesson_id: req.params.lesson_id,
      creator: req.currentUser._id,
    });

    await chapter.save();
    res.json(chapter).status(200);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      res.json({ message: "Required fields were not filled" }).status(400);
      return;
    }
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Update Chapter
router.get("/:id", async (req, res) => {
  try {
    if (!req.currentUser) {
      return res
        .status(400)
        .json({ message: "You must be logged in to update a lesson" });
    }
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter)
      return res.status(400).json({ message: "chapter does not exist" });

    if (!req.currentUser._id.equals(chapter.creator)) {
      console.log(req.currentUser._id, chapter.creator);
      return res.status(400).json({ message: "You cannot update this chapter" });
    }
    for (let key in req.body) chapter.set(key, req.body[key]);
    await chapter.save();
    res.json(chapter).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a chapter
router.delete("/:id", async (req, res) => {
  try {
    if (!req.currentUser) {
      return res
        .status(400)
        .json({ message: "You must be logged in to delete a lesson" });
    }
    const deleteChapter = await Chapter.findById(req.params.id);

    if (!deleteChapter)
      return res.status(400).json({ message: "Chapter does not exist" });

    if (!req.currentUser._id.equals(deleteChapter.creator)) {
      console.log(req.currentUser._id, deleteChapter.creator);
      return res.status(400).json({ message: "You cannot delete this chapter" });
    }
    const lessonId = deleteChapter.lesson_id;
    
    await deleteChapter.delete();
    
    const chapters = await Chapter.find({lesson_id: lessonId})

    for (let index in chapters) {
      let chapter = chapters[index];
      chapter.index = Number(index);
      await chapter.save();
    }

    res.json({message: "Chapter deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
  
});

export default router;
