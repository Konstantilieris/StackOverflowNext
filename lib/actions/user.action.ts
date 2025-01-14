"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";
export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, name, username, email, picture } = userData;
    const newUser = await User.create({
      clerkId,
      name,
      username,
      email,
      picture,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    // Delete user from database
    // questions,answers,comments ,etc
    // get user questions ids
    // const userQuestionIds = await Question.find({ athor: user._id }).distinct(  "_id" );
    await Question.deleteMany({ author: user._id });
    // TODO: delete user answers ,comments,etc
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
