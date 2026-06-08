import path from "path";
import {
  allowCors,
  cloudinaryConfigured,
  ensureStateLoaded,
  getCloudinaryClient,
  requireAdminSession
} from "../_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { fileData, fileName, folder, mediaType } = req.body ?? {};

    if (!fileData || typeof fileData !== "string") {
      res.status(400).json({ error: "fileData is required" });
      return;
    }

    if (!cloudinaryConfigured) {
      res.status(500).json({ error: "Cloudinary is not configured on the backend" });
      return;
    }

    const cloudinary = await getCloudinaryClient();
    if (!cloudinary) {
      res.status(500).json({ error: "Cloudinary is not configured on the backend" });
      return;
    }

    const resourceType = mediaType === "video" ? "video" : "image";
    const safeFolder = typeof folder === "string" && folder.trim() ? folder.trim() : "gmm";
    const publicId = typeof fileName === "string" && fileName.trim()
      ? path.parse(fileName.trim()).name.replace(/\s+/g, "-").toLowerCase()
      : `${resourceType}-${Date.now()}`;

    const uploadResult = await cloudinary.uploader.upload(fileData, {
      folder: safeFolder,
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
      unique_filename: true
    });

    res.status(200).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      originalFilename: uploadResult.original_filename
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Cloudinary upload failed",
      details: error?.message || "Unknown upload error"
    });
  }
}
