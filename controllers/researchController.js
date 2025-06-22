import Research from "../models/research.js";

const titleSymbolMap = {
  "Center for Human Mobility and Communications": "CHMC",
  "Center for Cognitive and Emotional Intelligence": "CCEI",
  "Center for Companion and Care Technologies": "CCCT",
  "Center for Inclusive Innovation & Assistive Tech Collaboration": "CIIATC",
};

export const addResearch = async (req, res) => {
  try {
    const { title, description, projects } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    // Create slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if slug already exists
    const existing = await Research.findOne({ slug });
    if (existing) {
      return res
        .status(409)
        .json({ message: "A research item with a similar title already exists." });
    }

    // Get symbol from map or generate fallback
    const symbol = titleSymbolMap[title];

    const newResearch = new Research({
      title,
      description,
      slug,
      symbol,
      projects: Array.isArray(projects) ? projects : [],
    });

    await newResearch.save();

    res.status(201).json({
      message: "Research entry created successfully.",
      data: newResearch,
    });
  } catch (error) {
    console.error("Error adding research:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllResearch = async (req, res) => {
  try {
    const researchList = await Research.find().lean();
    res.status(200).json(researchList);
  } catch (error) {
    console.error("Error fetching research data:", error);
    res.status(500).json({ message: "Failed to fetch research data" });
  }
};

export const getResearchById = async (req, res) => {
  const { slug } = req.params;
  try {
    const research = await Research.findOne({ slug });

    if (!research) {
      return res.status(404).json({
        message: "Research Wing not found",
      });
    }

    res.status(200).json(research);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export const updateResearchById = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    if (!description) {
      return res.status(400).json({
        message: "Description is required"
      })
    }

    const research = await Research.findById(id);

    if (!research) {
      return res.status(404).json({ message: "Research item not found." });
    }

    research.description = description;

    await research.save()

    res.status(200).json({
      message: "Research description updated successfully.",
      data: research,
    });

  } catch (error) {
    console.error("Error updating research:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}