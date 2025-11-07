import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const s3Config = {
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  UPLOAD_EXPIRY: 300, // upload expiry time in seconds (5 mins)
  DOWNLOAD_EXPIRY: 3600, // download expiry time in seconds (1 hour)
  MAX_FILE_SIZE: 1024 * 1024 * 100, // 100 MB
  ALLOWED_TYPES: {
    // all image types
    image: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/svg+xml",
      "image/webp",
      "image/avif",
      "image/heif",
      "image/heic",
      "image/jpg",
    ],
    video: ["video/mp4", "video/webm", "video/ogg"],
    pdf: ["application/pdf"],
  },
};
