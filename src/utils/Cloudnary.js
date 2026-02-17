import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import { log } from "console";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

const uploadOnCloudnary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    // upload the file
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    // file is uploaded successfully
    console.log("File is uploaded on cloudnary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); // remove the file from the server if any error
    return null;
  }
};

export { uploadOnCloudnary };
