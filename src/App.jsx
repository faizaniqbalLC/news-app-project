import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Routes from "./routes/Routes";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes />
      <ToastContainer />
    </>
  );
};

export default App;
