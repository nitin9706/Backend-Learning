import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudnary } from "../utils/Cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // how to register the user in the server
  // get the data from the frontend
  // validate the data came from the frontend
  // upload image to cloudnary
  // check the response came from cloudnary and get the url from the response
  // make the final user object to add in the mongodb
  // check that the data is registered or not
  // send the response

  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field are required ");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exist ");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar is not found");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "error while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
export { registerUser };
