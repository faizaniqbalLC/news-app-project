import React from "react";
import { FaYinYang } from "react-icons/fa6";

const Preloader = () => {
  return (
    <div>
      <FaYinYang className="mx-auto size-10 animate-spin text-red-500" />
    </div>
  );
};

export default Preloader;
