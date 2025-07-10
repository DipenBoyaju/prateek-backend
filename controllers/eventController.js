import Event from "../models/event.js";
import { generateUniqueSlug } from "../utils/slugifyUnique.js";

export const addEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      time,
      location,
      image = "",
      publish,
    } = req.body;

    // Validate required fields
    if (!title || !description || !startDate || !time || !location) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }
    const slug = await generateUniqueSlug(title);

    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : undefined;

    if (isNaN(startDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid startDate format." });
    }
    if (endDate && isNaN(endDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid endDate format." });
    }

    // Create and save new event
    const newEvent = new Event({
      title,
      description,
      slug,
      startDate: startDateObj,
      endDate: endDateObj,
      time,
      location,
      image,
      publish,
    });

    const savedEvent = await newEvent.save();

    return res.status(201).json({
      message: "Event created successfully.",
      event: savedEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      time,
      location,
      image = "",
      publish,
    } = req.body;

    // Validate required fields (optional but good practice)
    if (!title || !description || !startDate || !time || !location) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : undefined;

    if (isNaN(startDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid startDate format." });
    }

    if (endDate && isNaN(endDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid endDate format." });
    }

    const updates = {
      title,
      description,
      startDate: startDateObj,
      endDate: endDateObj,
      time,
      location,
      image,
      publish
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const publishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: { publish } },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event Published", event: updatedEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

