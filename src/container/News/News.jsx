import React, { useMemo } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Preloader from "../../components/Preloader";
import useNews from "../../hooks/useNews";
import NewsItem from "../../components/NewsItem";

const News = (props) => {
  const {
    loading,
    isLoading,
    articles,
    searchedArticles,
    searchTerm,
    searchHistory,
    showSearchHistory,
    isError,
    retryFunction,
    inputRef,
    historyListRef,
    newsEndRef,
    handleSearchChange,
    loadMoreArticles,
    scrollToTop,
    handleInputFocus,
    clearSearchHistory,
    handleHistoryItemClick,
  } = useNews(props.category);

// Memoizing articles for performance optimization

  const memoizedArticles = useMemo(
    () =>
      (searchTerm.trim() === "" ? articles : searchedArticles).map(
        (item, index) => 
          <NewsItem
            key={index}
            title={item.title}
            description={item.description}
            urlToImage={item.urlToImage}
            url={item.url}
            author={item.author}
            source={item.source.name}
            publishedAt={item.publishedAt}
            item={item}
          />
        ,
      ),
    [articles, searchedArticles, searchTerm],
  );
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8 py-4 md:px-16">
        <div className="flex flex-col items-center py-4 md:flex-row md:justify-between">
          <h1 className="mb-4 text-center text-2xl font-semibold text-red-500 md:text-3xl">
            Top Articles
          </h1>
          <span className="relative flex">
            <input
              type="text"
              placeholder="Search..."
              className="rounded border bg-transparent px-3 py-2 text-black dark:text-white"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              ref={inputRef}
            />
            {showSearchHistory && searchHistory?.length > 0 && (
              <div
                ref={historyListRef}
                className="absolute left-0 right-0 z-[9999] mt-12 rounded border border-gray-200 bg-white shadow-md dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="p-2 dark:text-white">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Recent Searches
                    </span>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={clearSearchHistory}
                    >
                      Clear All
                    </button>
                  </div>
                  {searchHistory.map((historyItem, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleHistoryItemClick(historyItem)}
                    >
                      {historyItem.length > 15
                        ? `${historyItem.slice(0, 15)}...`
                        : historyItem}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </span>
        </div>
        {loading && (
          <div className="mt-2 flex h-[70vh] items-center justify-center">
            <Preloader />
          </div>
        )}
        {isError && (
          <div className="mt-2 flex h-[70vh] items-center justify-center">
            <button
              className="rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={retryFunction}
            >
              Try Again
            </button>
          </div>
        )}
        <div className="mb-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {((searchTerm.trim() === "" ? articles : searchedArticles).length ===0 &&!loading&&isError===false) && (
              <div className="col-span-full flex h-[60vh] items-center justify-center">
                <p className="text-red-500 dark:text-red-500">No data found</p>
              </div>
            )}
          {memoizedArticles}
        </div>
        <div ref={newsEndRef}></div>
        {(searchTerm.trim() === "" ? articles : searchedArticles).length !== 0 && !loading && (
          <div className="mt-4 flex justify-center">
            <button
              disabled={isLoading}
              className={`rounded bg-red-500 ${isLoading ? 'px-12' : 'px-4'} py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400`}
              onClick={loadMoreArticles}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2 w-[24px] h-[24px]" />
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <IoIosArrowUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default News;
