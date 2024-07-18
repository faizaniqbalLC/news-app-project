import React, { Component } from "react";
import { FaYinYang } from "react-icons/fa6";

export default class Preloader extends Component {
  render() {
    return (
      <div>
        <FaYinYang className="mx-auto size-10 animate-spin text-red-500" />
      </div>
    );
  }
}
