import Gallery from "../models/gallery.js";
import { v2 as cloudinary } from 'cloudinary';

export const uploadMultipleImages = async (req, res) => {
  try {
    const uploadedImages = req.files.map(file => ({
      imageUrl: file.path,
    }));

    const saved = await Gallery.insertMany(uploadedImages);
    res.json({ message: 'Images uploaded successfully', data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

export const getAllImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const total = await Gallery.countDocuments();
    const images = await Gallery.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Find image doc in DB
    const image = await Gallery.findById(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Extract public_id from URL for Cloudinary
    // e.g. https://res.cloudinary.com/mycloud/image/upload/v123/gallery/12345-filename.jpg
    const urlParts = image.imageUrl.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // gallery/12345-filename.jpg
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove file extension

    // Delete image from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
    if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
      // 'not found' means already deleted or never existed, treat as success or log
      console.warn(`Cloudinary deletion returned: ${cloudinaryResult.result}`);
    }

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(imageId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};