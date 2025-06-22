import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      enum: [
        "Executive",
        "Research",
        "Product Development",
        "Management",
        "Consultants",
      ],
      required: true,
      trim: true,
    },
    division: {
      type: String,
      enum: [
        "Center for Human Mobility and Communications",
        "Center for Cognitive and Emotional Intelligence",
        "Center for Companion and Care Technologies",
        "Center for Inclusive Innovation & Assistive Tech Collaboration",
      ],
      required: false,
      default: undefined,
    },
    divisionSymbol: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Staff", "Intern", "Consultant"],
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    socials: {
      type: Map,
      of: String, // key: platform, value: URL
      default: {},
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
