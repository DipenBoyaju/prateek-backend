import mongoose from 'mongoose'


const projectModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
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
  subProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubProject',
  }]
},
  { timestamps: true }
)

const Project = mongoose.model("Project", projectModel)

export default Project;