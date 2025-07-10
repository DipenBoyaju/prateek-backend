import Project from "../models/project.js";
import SubProject from "../models/subProject.js";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";

const titleSymbolMap = {
  "Center for Human Mobility and Communications": "CHMC",
  "Center for Cognitive and Emotional Intelligence": "CCEI",
  "Center for Companion and Care Technologies": "CCCT",
  "Center for Inclusive Innovation & Assistive Tech Collaboration": "CIIATC",
};

export const addSubProject = async (req, res) => {
  try {
    const {
      title,
      description,
      division,
      mainProject,
      datasetLink,
      teamMember,
      partnerOrganization,
      image,
    } = req.body;

    if (!title || !description || !division || !mainProject) {
      return res.status(400).json({ message: "Field is required." });
    }

    const cleanedDivision = division === "" ? undefined : division;

    const divisionSymbol = titleSymbolMap[cleanedDivision] || "";

    const slug = await generateUniqueSlug(title);

    const existing = await SubProject.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Project with this title already exists." });
    }

    const newSubProject = new SubProject({
      title,
      description,
      division,
      divisionSymbol,
      slug,
      image,
      mainProject,
      datasetLink: datasetLink || "",
      teamMember: Array.isArray(teamMember) ? teamMember : [],
      partnerOrganization: Array.isArray(partnerOrganization) ? partnerOrganization : [],
    })

    await newSubProject.save();

    await Project.findByIdAndUpdate(
      mainProject,
      { $push: { subProjects: newSubProject._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Project created successfully.",
      project: newSubProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
}

export const getAllSubProject = async (req, res) => {
  try {
    const projects = await SubProject.find().sort({ createdAt: -1 })
    res.status(200).json({
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getProjectsByMainId = async (req, res) => {
  try {
    const { mainProject } = req.query;

    if (!mainProject) {
      return res.status(400).json({ message: "mainProject ID is required in query." });
    }

    const projects = await SubProject.find({ mainProject }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching subprojects by mainProject ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSubProjectBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const project = await SubProject.findOne({ slug });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const deleteSubProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await SubProject.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    await Project.findByIdAndUpdate(
      deletedProject.mainProject,
      { $pull: { subProjects: deletedProject._id } }
    );

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editSubProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    division,
    mainProject,
    image,
    datasetLink,
    teamMember,
    partnerOrganization,
  } = req.body;

  if (!title || !description || !division) {
    return res.status(400).json({ message: "Field is required." });
  }

  try {
    const existingProject = await SubProject.findOne({ _id: id });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    let slug = existingProject.slug;

    if (title !== existingProject.title) {
      slug = await generateUniqueSlug(title, existingProject._id);
    }

    const divisionSymbol = titleSymbolMap[division] || "";

    const updateFields = {
      title,
      description,
      slug,
      division,
      divisionSymbol,
      image,
      datasetLink: datasetLink || "",
      teamMember: Array.isArray(teamMember) ? teamMember : [],
      partnerOrganization: Array.isArray(partnerOrganization) ? partnerOrganization : [],
    };

    if (mainProject) {
      updateFields.mainProject = mainProject;
    }

    const updatedProject = await SubProject.findByIdAndUpdate(
      id,
      updateFields,
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

export const getProjectByDivision = async (req, res) => {
  try {
    const { divisionSymbol } = req.query;

    if (!divisionSymbol) {
      return res.status(400).json({ message: "Division query is required" });
    }

    const projects = await SubProject.find({ divisionSymbol: divisionSymbol }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by division:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
