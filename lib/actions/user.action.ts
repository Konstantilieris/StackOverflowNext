"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/question.model";
import Tag from "@/database/models/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/models/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 2 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }
    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
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
export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  const { userId, path, questionId } = params;
  try {
    connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    let updateQuery;
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      updateQuery = {
        $pull: {
          saved: questionId,
        },
      };
    } else {
      updateQuery = {
        $push: {
          saved: questionId,
        },
      };
    }
    await User.findByIdAndUpdate(userId, updateQuery, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    // eslint-disable-next-line no-unused-vars
    const { clerkId, page = 1, pageSize = 2, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOption = {};
    switch (filter) {
      case "most_recent":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "most_voted":
        sortOption = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOption = { views: -1 };
        break;
      case "most_answered":
        sortOption = { answers: -1 };
        break;
      default:
        break;
    }
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOption,
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    const isNext = user.saved.length > pageSize;
    if (!user) {
      throw new Error("User not found");
    }

    return { questions: user.saved, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    const [questionUpvotes] = await Question.aggregate([
      {
        $match: { author: user._id },
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    const [answerUpvotes] = await Answer.aggregate([
      {
        $match: { author: user._id },
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },

      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];
    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 2 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
    const isNext = totalQuestions > skipAmount + userQuestions.length;
    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: -1 })
      .populate("author", "_id clerkId name picture")
      .populate("question", "_id title");
    const isNext = totalAnswers > skipAmount + userAnswers.length;
    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
