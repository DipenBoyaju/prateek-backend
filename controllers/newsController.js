import News from "../models/news.js";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";


export const createNews = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All Fields required" });
  }

  try {
    const slug = await generateUniqueSlug(title)

    const newNews = new News({
      title,
      slug,
      description
    })

    const savedNews = await newNews.save()

    res.status(201).json({
      message: "News added successfully.",
      news: savedNews
    });

  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 })
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching all news:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getNewsBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const news = await News.findOne({ slug });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const editNews = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingNews = await News.findOne({ _id: id });

    if (!existingNews) {
      return res.status(404).json({ message: "News not found." });
    }

    let slug = existingNews.slug;

    // Only regenerate slug if title has changed
    if (title !== existingNews.title) {
      slug = await generateUniqueSlug(title, existingNews._id);
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, description, slug },
      { new: true }
    );

    res.status(200).json({
      message: "News updated successfully",
      news: updatedNews,
    });

  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ message: "News deleted successfully." });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Server error" });
  }
};