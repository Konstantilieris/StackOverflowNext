import React from "react";

import { formatLargeNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import StatsCard from "../cards/StatsCard";
interface StatProps {
  totalQuestions: number;
  totalAnswers: number;
  reputation: number;
  badges: BadgeCounts;
}
const Stats = ({
  totalAnswers,
  totalQuestions,
  reputation,
  badges,
}: StatProps) => {
  return (
    <>
      <h3 className="h3-semibold text-dark200_light900 mt-4 ">
        Stats - {reputation}
      </h3>
      <div className="text-dark200_light800 mt-4 grid grid-cols-1 gap-4  xs:grid-cols-2 md:grid-cols-4">
        <div className="stats-card">
          <div className="flex flex-col">
            <p className="paragraph-semibold text-center ">
              {formatLargeNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div className="flex flex-col">
            <p className="paragraph-semibold text-center">
              {formatLargeNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badges?.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badges?.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badges?.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </>
  );
};

export default Stats;
