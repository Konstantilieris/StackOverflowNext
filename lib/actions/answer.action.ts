"use server";

import Answer from "@/database/models/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/models/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/models/user.model";
import Interaction from "@/database/models/interaction.model";
export async function createAnswer(params: CreateAnswerParams) {
  try {
    const { content, author, question, path } = params;
    connectToDatabase();
    const newAnswer = await Answer.create({ author, question, content });
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAnswers(params: GetAnswersParams) {
  try {
    const { questionId, filter, page = 1, pageSize = 6 } = params;
    const skipAmount = (page - 1) * pageSize;
    let sortOption = {};
    switch (filter) {
      case "highestUpvotes":
        sortOption = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOption = { upvotes: 1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;
      default:
        break;
    }
    const answers = await Answer.find({ question: JSON.parse(questionId) })
      .populate({
        path: "author",
        select: "_id clerkId name picture",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOption);
    const totalAnswers = await Answer.countDocuments({
      question: JSON.parse(questionId),
    });
    const isNext = totalAnswers > skipAmount + answers.length;
    return { answers, isNext };
  } catch (error) {
    console.log(error);
  }
}
export async function upVoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
    connectToDatabase();
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function downVoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
    connectToDatabase();
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw Error("no Answer found");
    }
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function DeleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findByIdAndDelete(answerId);
    if (!answer) {
      throw new Error("answer not found");
    }
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
