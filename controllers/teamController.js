import Team from "../models/team.js";


export const createTeamMember = async (req, res) => {
  try {
    const { name, designation, image, department, division } = req.body;

    const newMember = new Team({
      name,
      role,
      post,
      image,
      department,
      designation
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTeamByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const members = await Team.find({ department: department.toLowerCase() });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching team by department:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
