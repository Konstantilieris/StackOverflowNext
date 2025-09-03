import React from "react";
import Link from "next/link";
interface Props {
  tag: {
    _id: number;
    name: string;
    description: string;
    followers: string[];
    createdOn: Date;
    questions: string[];
  };
}
const TagCard = ({ tag }: Props) => {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 ">
        <div className="background-light700_dark400  mt-2 self-center rounded-md text-center">
          <h3 className="base-medium text-dark200_light900 background-light700_dark400 m-4 line-clamp-1">
            {tag.name}
          </h3>
        </div>
        <div className="mt-4 text-center">
          <p className="body-regular text-dark400_light700">
            Java Script ,often abbreviated as JS, is a programming language that
            is one of the core technologies of the World Wide Web,alongside html
            and Css
          </p>
        </div>
        <div className="mt-4 flex flex-row items-center">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {tag.questions.length}+
          </span>{" "}
          <span className="text-dark500_light500">Questions</span>
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
