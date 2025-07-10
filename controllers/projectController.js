import Project from "../models/project.js";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";

const titleSymbolMap = {
  "Center for Human Mobility and Communications": "CHMC",
  "Center for Cognitive and Emotional Intelligence": "CCEI",
  "Center for Companion and Care Technologies": "CCCT",
  "Center for Inclusive Innovation & Assistive Tech Collaboration": "CIIATC",
};

export const addProject = async (req, res) => {
  try {
    const { title, description, division } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    const cleanedDivision = division === "" ? undefined : division;

    const divisionSymbol = titleSymbolMap[cleanedDivision] || "";

    const slug = await generateUniqueSlug(title);

    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Project with this title already exists." });
    }

    const newProject = new Project({
      title,
      description,
      division: cleanedDivision,
      divisionSymbol,
      slug
    })

    await newProject.save();

    res.status(201).json({
      message: "Project created successfully.",
      project: newProject,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
}


export const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const project = await Project.findOne({ slug });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const editProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, division } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingProject = await Project.findOne({ _id: id });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    let slug = existingProject.slug;

    // Only regenerate slug if title has changed
    if (title !== existingProject.title) {
      slug = await generateUniqueSlug(title, existingProject._id);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, slug, division },
      { new: true }
    );

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });

  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
};
