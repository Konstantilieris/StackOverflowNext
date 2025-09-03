"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Tag from "@/database/models/tag.model";
import Answer from "@/database/models/answer.model";
import User from "@/database/models/user.model";
const SearchableTypes = ["question", "user", "tag", "answer"];
export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let results: any = [];
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
      { model: Answer, searchField: "content", type: "answer" },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);
        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Anwers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkid
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      // search specific type
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);
      if (!modelInfo) {
        throw new Error("Invalid type");
      }
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);
      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Anwers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkid
            : type === "answer"
            ? item.question
            : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
