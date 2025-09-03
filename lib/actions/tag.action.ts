"use server";
import Tag, { ITag } from "@/database/models/tag.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/models/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    // Find interactions for the user and group by tags...
    // interactions...
    return ["tag1", "tag2", "tag3"];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 6 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }
    let sortOption = {};
    switch (filter) {
      case "popular":
        sortOption = { followers: -1 };
        break;
      case "recent":
        sortOption = { createdOn: -1 };
        break;
      case "name":
        sortOption = { name: -1 };
        break;
      case "old":
        sortOption = { createdOn: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOption);
    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    connectToDatabase();
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      match: query,
      model: Question,
      options: {
        skip: skipAmount,
        limit: pageSize,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });
    if (!tag) {
      throw new Error("User not found");
    }
    const isNext = tag.questions.length > pageSize;
    return { tagTitle: tag.name, questions: tag.questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getTopPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberofQuestions: { $size: "$questions" } } },
      { $sort: { numberofQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
  }
}
