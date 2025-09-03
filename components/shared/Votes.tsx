"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { formatLargeNumber } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { upVoteAnswer, downVoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
interface Props {
  type: string;
  userId: string;
  itemId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  userId,
  itemId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const path = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path,
    });
  };
  const handleVote = async (action: string) => {
    if (action === "upvote") {
      if (type === "question") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } else if (type === "answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      }

      return;
    }
    if (action === "downvote") {
      if (type === "question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      } else if (type === "answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path,
        });
      }
    }
  };
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, path, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="arrowdown"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(downvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          {type === "question" && (
            <Image
              src={
                hasSaved
                  ? "/assets/icons/star-filled.svg"
                  : "/assets/icons/star-red.svg"
              }
              alt="star"
              width={18}
              height={18}
              className="cursor-pointer"
              onClick={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Votes;
