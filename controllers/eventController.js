import Event from "../models/event.js";


export const addEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, image, category } = req.body;

    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      image: image || "",
      category: category || "",
    });

    const savedEvent = await newEvent.save();

    return res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
