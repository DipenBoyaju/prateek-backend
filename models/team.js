import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      default: ""
    },
    department: {
      type: String,
      enum: ['Executive', 'Research', 'Product Development', 'Management', 'Consultants'],
      required: true,
      lowercase: true,
      trim: true,
    },
    division: {
      type: String,
      enum: ['Center for Human Mobility and Communications', 'Center for Cognitive and Emotional Intelligence'],
    },
    divisionSymbol: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
