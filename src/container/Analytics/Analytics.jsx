import React, { useContext, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { NewsContext } from "../../contextApi/NewsContext";

const Analytics = () => {
  const { history, removeAllHistory } = useContext(NewsContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8  py-4  md:px-16">
        <div className="flex flex-col items-center py-4 md:flex-row md:justify-between">
          <h1 className="mb-4 text-center text-2xl font-semibold text-red-500 md:text-3xl">
            History
          </h1>

          <span className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Search..."
              className="rounded border bg-transparent px-3 py-2 text-black  dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="rounded bg-red-500 px-4 py-2 text-white"
              onClick={removeAllHistory}
            >
              Clear all history
            </button>
          </span>
        </div>

        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="relative mb-4 flex flex-col shadow-lg"
            >
              <div className="grow border  border-gray-300 p-4 dark:border-gray-600">
                <h1 className="mb-1 text-xl font-bold dark:text-white">
                  {item.title}
                </h1>
                <p className="mb-3 dark:text-white">{item.description}</p>
                <p className="text-sm font-semibold text-gray-500">
                  {item.timeToVisit}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[70vh] items-center justify-center">
            <p className="text-center text-red-500 dark:text-red-400">
              No data found
            </p>
          </div>
        )}

        <div className="mb-2 flex justify-between px-4">
          {filteredHistory.length > 0 && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 rounded bg-red-500 px-4 py-[12px] text-white"
            >
              <IoIosArrowUp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Analytics);
