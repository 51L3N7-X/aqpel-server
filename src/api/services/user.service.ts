import httpStatus from "http-status";
import { User } from "../models/user";
import { ApiError } from "../utils/ApiError";

export const updateUser = async (userId: string, updateBody: any) => {
  const user = await User.findById(userId);
  if (!user || !Object.keys(user).length)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const username = updateBody.username;
  if (user.username != username && (await User.isUserNameTaken(username))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Sorry, ${username} username has already been taken. Please choose a different username.`
    );
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !Object.keys(user).length)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
};
