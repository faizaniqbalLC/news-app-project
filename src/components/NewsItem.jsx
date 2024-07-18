import React, { useContext, useState } from "react";
import dummyImage from "../assets/dummy-news.jpg";
import { FaAnglesRight } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { NewsContext } from "../contextApi/NewsContext";

const NewsItem = ({
  title,
  description,
  urlToImage,
  publishedAt,
  url,
  author,
  source,
  item,
  key
}) => {
  const { addToHistory } = useContext(NewsContext);
  const handleItemClick = (item) => {
    const newItem = {
      ...item,
      timeToVisit: new Date().toLocaleString(), // Store date and time
      id: uuidv4(),
    };
    addToHistory(newItem);
  };
  return (
    <a
      onClick={() => handleItemClick({ ...item })}
      href={url}
      target=".blank"
      className="relative flex flex-col shadow-lg"
      key={key}
    >
      <div className="absolute right-0 top-0 rounded-lg bg-red-500 px-2 py-1 text-sm font-semibold text-white">
        {source}
      </div>
      <img src={urlToImage ? urlToImage : dummyImage} className="w-full" />
      <div className="grow border border-t-0 border-gray-300 p-4 dark:border-gray-600">
        <h1 className="mb-1 text-[16px] font-bold dark:text-white "> {title?.length > 100
          ? `${title?.slice(0, 100)}...`
          : title}</h1>
        <p className="mb-3 text-[12px] dark:text-white">{description?.length > 150
          ? `${description?.slice(0, 150)}...`
          : description}</p>
        <div className="mb-3 inline-block border border-red-500 px-4 py-2 font-medium text-red-500 hover:bg-red-500 hover:text-white">
          Read More <FaAnglesRight className="inline" />
        </div>
        <p className="text-[11px] font-semibold text-gray-500">
          By {author ? author : "Unknown"} on{" "}
          {new Date(publishedAt).toUTCString()}
        </p>
      </div>
    </a>
  );
};

export default NewsItem;
