"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { DeleteQuestion } from "@/lib/actions/question.action";
import { DeleteAnswer } from "@/lib/actions/answer.action";
interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "question") {
      await DeleteQuestion({ path, questionId: JSON.parse(itemId) });
    } else if (type === "answer") {
      await DeleteAnswer({ path, answerId: JSON.parse(itemId) });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
