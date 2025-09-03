import Link from "next/link";
import React from "react";

import Metric from "../shared/Metric";
import { Types } from "mongoose";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";
import ParseHTML from "../shared/ParseHTML";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
interface AnswerProps {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: number;
  question: Types.ObjectId;
  createdAt: Date;
  clerkId: string | null;
  totalAnswers: number;
  content: string;
}
const AnswerCard = ({
  _id,
  title,
  author,
  upvotes,
  createdAt,
  question,
  clerkId,
  content,
  totalAnswers,
}: AnswerProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${question?._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
          <p className="  text-dark200_light900 mt-2 flex-1 font-semibold ">
            <ParseHTML data={content} />
          </p>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={`- asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor={true}
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatLargeNumber(upvotes)}
          title="votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatLargeNumber(totalAnswers)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default AnswerCard;
