import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Config, s3Client } from "../config/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { v4 as uuidv4 } from "uuid";

class S3Service {
  async generateUploadUrl(userId, fileName, fileType, contentType) {
    try {
      this.validateFileType(fileType, contentType);
      const fileExtention = path.extname(fileName);
      const key = `posts/${userId}/${uuidv4()}${fileExtention}`;

      const command = new PutObjectCommand({
        Bucket: s3Config.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Metadata: {
          userId,
          originalFileName: fileName,
          uploadedAt: new Date().toISOString(),
        },
        ServerSideEncryption: "AES256",
      });

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: s3Config.UPLOAD_EXPIRY,
      });
      return {
        uploadUrl,
        key,
        expiresIn: s3Config.UPLOAD_EXPIRY,
      };
    } catch (error) {
      console.log("Error while generating upload url:", error);
      throw error;
    }
  }

  validateFileType(fileType, contentType) {
    console.log(
      "Validating file type:",
      fileType,
      "Content Type:",
      contentType
    );
    const allowedTypes = s3Config.ALLOWED_TYPES[fileType];
    if (!allowedTypes) throw new Error("Invalid file category:", fileType);
    if (!allowedTypes.includes(contentType))
      throw new Error("Invalid file type");
  }
}

export const s3Service = new S3Service();
