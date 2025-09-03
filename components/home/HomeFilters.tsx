"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
const HomeFilters = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const query = searchParams.get("filter");
  const [filter, setfilter] = useState(query || "");

  const handleTypeClick = (item: string) => {
    if (filter === item) {
      setfilter("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setfilter(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          value={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none 
        ${
          filter === item.value
            ? "bg-primary-100 text-primary-500 hover:scale-105"
            : "bg-light-800 text-light-500 hover:scale-105 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
        }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
