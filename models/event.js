import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'ended'],
      default: 'upcoming',
    },
    publish: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);


eventSchema.pre("save", function (next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(this.startDate);
  start.setHours(0, 0, 0, 0);

  // If no endDate provided, treat it as a one-day event
  let end = this.endDate ? new Date(this.endDate) : new Date(this.startDate);
  end.setHours(0, 0, 0, 0);

  if (today >= start && today <= end) {
    this.status = "ongoing";
  } else if (today < start) {
    this.status = "upcoming";
  } else if (today > end) {
    this.status = "ended";
  }

  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
