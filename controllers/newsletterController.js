import Newsletter from "../models/newsletter.js";
import { supabase } from '../utils/supabaseClient.js';
import { convert } from 'pdf-poppler';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

// dotenv.config()
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadNewsletter = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { buffer, originalname } = req.file;
    const { title } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const filePath = `newsletters/${Date.now()}-${Math.floor(Math.random() * 1000)}-${originalname}`;

    // ✅ Upload PDF to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('newsletters')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('newsletters')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    const publicUrl = publicUrlData.publicUrl;

    // ✅ Save buffer locally to temp file for cover generation
    const tempPdfPath = `./uploads/${Date.now()}-${originalname}`;
    fs.writeFileSync(tempPdfPath, buffer);

    // ✅ Generate cover JPG from page 1
    const opts = {
      format: 'jpeg',
      out_dir: './uploads',
      out_prefix: path.basename(tempPdfPath, '.pdf'),
      page: 1,
    };
    await convert(tempPdfPath, opts);

    const coverPath = `./uploads/${opts.out_prefix}-1.jpg`;

    // ✅ Upload cover image to Cloudinary
    const cloudinaryRes = await cloudinary.v2.uploader.upload(coverPath, {
      folder: 'newsletter-covers',
    });

    const coverUrl = cloudinaryRes.secure_url;

    // ✅ Save newsletter in MongoDB with both URLs
    const savedNewsletter = await Newsletter.create({
      title,
      fileUrl: publicUrl,
      fileKey: filePath,
      coverUrl,
    });

    // ✅ Clean up temp files
    fs.unlinkSync(tempPdfPath);
    fs.unlinkSync(coverPath);

    res.status(201).json({ message: 'Uploaded', data: savedNewsletter });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};


export const getAllNewsletters = async (req, res) => {
  try {
    const all = await Newsletter.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch newsletters" });
  }
};

export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    // Delete from Supabase
    const { error: storageError } = await supabase.storage
      .from("newsletters")
      .remove([newsletter.fileKey]);

    if (storageError) {
      console.error("Supabase delete error:", storageError);
      return res.status(500).json({ error: "Failed to delete from storage" });
    }

    // Delete from MongoDB
    await Newsletter.findByIdAndDelete(id);

    res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};

