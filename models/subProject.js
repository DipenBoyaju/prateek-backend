import mongoose from 'mongoose'

const subProjectModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
    required: true,
    default: undefined,
  },
  divisionSymbol: {
    type: String,
    default: "",
  },
  mainProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  image: {
    type: String,
    required: false
  },
  datasetLink: {
    type: String,
    required: false,
  },
  teamMember: [
    {
      name: String,
      role: String,
      image: String,
    }
  ],
  partnerOrganization: [
    {
      name: String,
      website: String,
      logo: String,
      address: String,
    }
  ]
}, { timestamps: true })

const SubProject = mongoose.model('SubProject', subProjectModel)

export default SubProject;