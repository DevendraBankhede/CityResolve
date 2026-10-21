import cloudinary from "../config/cloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";

const uploadBufferToCloudinary = (fileBuffer, folder = "CityResolve_uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export const uploadImage = async (req, res) => {
  try {
    const hasCloudinaryConfig = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    // Single file upload
    if (req.file) {
      let imageUrl = "";
      let publicId = `upload_${Date.now()}`;

      if (hasCloudinaryConfig) {
        const result = await uploadBufferToCloudinary(req.file.buffer);
        imageUrl = result.secure_url || result.url;
        publicId = result.public_id;
      } else {
        // Fallback to base64 Data URI when Cloudinary is not configured
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }

      return successResponse(res, 200, "Image uploaded successfully", {
        url: imageUrl,
        path: imageUrl,
        filename: publicId,
        public_id: publicId,
      });
    }

    // Multiple files upload
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedFiles = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        let imageUrl = "";
        let publicId = `upload_${Date.now()}_${i}`;

        if (hasCloudinaryConfig) {
          const result = await uploadBufferToCloudinary(file.buffer);
          imageUrl = result.secure_url || result.url;
          publicId = result.public_id;
        } else {
          imageUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        }

        uploadedFiles.push({
          url: imageUrl,
          path: imageUrl,
          filename: publicId,
          public_id: publicId,
        });
      }

      return successResponse(res, 200, "Images uploaded successfully", {
        images: uploadedFiles,
        url: uploadedFiles[0]?.url,
        path: uploadedFiles[0]?.path,
      });
    }

    return errorResponse(res, 400, "No image file provided");
  } catch (error) {
    console.error("Image upload error:", error);
    return errorResponse(
      res,
      500,
      error.message || "Failed to process image upload"
    );
  }
};