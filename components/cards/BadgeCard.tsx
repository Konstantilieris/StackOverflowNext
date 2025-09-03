import React from "react";
import Image from "next/image";

interface Props {
  type: "bronze" | "silver" | "gold";
  reputation: number;
}
const BadgeCard = ({ type, reputation }: Props) => {
  return (
    <div className="stats-card">
      <Image
        src={`/assets/icons/${type}-medal.svg`}
        width={40}
        height={40}
        alt="medal"
      />
      <div className="flex flex-col justify-center">
        <p className="paragraph-semibold">{reputation}</p>
        <p className="body-medium text-dark400_light700">
          {type.charAt(0).toUpperCase() + type.slice(1)} Badges
        </p>
      </div>
    </div>
  );
};

export default BadgeCard;
