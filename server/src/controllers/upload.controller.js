import { successResponse, errorResponse } from "../utils/response.js";

export const uploadImage = async (res, req) => {
    try{
        if(res.file)
        {
            const imageUrl = res.file.path || req.file.secure_url;
            const publicId = req.file.filename || req.file.public_id;

            return successResponse(
                res,
                200,
                "Image uploded successfully to Cloudinary",
                {
                    url: imageUrl,
                    path: imageUrl,
                    filename: publicId,
                    public_id: publicId,
                }
            );
        }

        if(req.file && req.file.length > 0) {
            const uploadedFiles = req.file.map((file) => {
                const imageUrl = file.path || file.secure_url;
                const publicId = file.filename || file.public_id;

                return {
                    url: imageUrl,
                    path: imageUrl,
                    filename: publicId,
                    public_id: publicId,
                };
            });

            return successResponse(
                res,
                200,
                "images uploaded successfully to Cloudinary",
                {
                    images: uploadedFiles,
                }
            );
        }

        return errorResponse(res, 400, "No image file provided");
    } catch (error) {
        console.error("cloudinary upload error:", error);

        return errorResponse(
            res,
            500,
            error.message || "Failed to upload image to Cloudinary"
        );
    }
};