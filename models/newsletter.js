import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileKey: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    required: true,
  },
  publish: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true }
)

const Newsletter = mongoose.model("Newsletter", newsletterSchema)

export default Newsletter;