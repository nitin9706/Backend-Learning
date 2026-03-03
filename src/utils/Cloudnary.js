import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    // upload the file
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    // file is uploaded successfully
    // console.log("File is uploaded on cloudnary", response.url);
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); // remove the file from the server if any error
    return console.log(`there is some error with ${error}`);
  }
};
const DeleteCloudnaryFile = async (public_id) => {
  const response = await cloudinary.uploader.destroy(public_id);
  return response;
};

export { uploadOnCloudnary, DeleteCloudnaryFile };
