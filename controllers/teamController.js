import Team from "../models/team.js";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";

const titleSymbolMap = {
  "Center for Human Mobility and Communications": "CHMC",
  "Center for Cognitive and Emotional Intelligence": "CCEI",
  "Center for Companion and Care Technologies": "CCCT",
  "Center for Inclusive Innovation & Assistive Tech Collaboration": "CIIATC",
};

export const createTeamMember = async (req, res) => {
  try {

    let { name, designation, image, department, division, category, bio, socials, } = req.body;

    if (division === "") {
      division = undefined;
    }

    const divisionSymbol = titleSymbolMap[division] || "";

    const slug = await generateUniqueSlug(name);

    const newMember = new Team({
      name,
      slug,
      designation,
      image,
      department,
      division,
      divisionSymbol,
      category,
      bio,
      socials: socials ? Object.fromEntries(socials.map(s => [s.platform, s.url])) : {},
    });

    const savedMember = await newMember.save();

    res.status(201).json({
      message: "Team member added successfully.",
      member: savedMember
    });

  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTeamByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const members = await Team.find({ department: department });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching team by department:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMemberBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const member = await Team.findOne({ slug });
    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }

    res.status(200).json(member)
  } catch (error) {
    console.error("Error fetching member by slug:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const editTeamMember = async (req, res) => {
  try {
    const { slug: paramSlug } = req.params;
    let {
      name,
      designation,
      image,
      department,
      division,
      category,
      bio,
      socials,
    } = req.body;

    if (division === "") {
      division = undefined;
    }

    // Find member by slug
    const existingMember = await Team.findOne({ slug: paramSlug });

    if (!existingMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    // Generate new slug only if name is changed
    let slug = existingMember.slug;
    if (name !== existingMember.name) {
      slug = await generateUniqueSlug(name, existingMember._id);
    }

    const divisionSymbol = titleSymbolMap[division] || "";

    const updatedMember = await Team.findByIdAndUpdate(
      existingMember._id,
      {
        name,
        slug,
        designation,
        image,
        department,
        division,
        divisionSymbol,
        category,
        bio,
        socials: socials ? Object.fromEntries(socials.map(s => [s.platform, s.url])) : {},
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Team member updated successfully.",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Team.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTeamMember = async (req, res) => {
  try {
    const members = await Team.find();
    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("Error getting team details:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
      error: error.message,
    });
  }
};


