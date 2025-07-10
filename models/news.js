import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  publish: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

const News = mongoose.model('News', newsSchema);

export default News;