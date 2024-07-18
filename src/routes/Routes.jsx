import React, { Suspense, lazy } from "react";
import { Route, Routes as Routess } from "react-router-dom";
import Preloader from "../components/Preloader";

// Lazy load components
const News = lazy(() => import("../container/News/News"));
const Analytics = lazy(() => import("../container/Analytics/Analytics"));

const Routes = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex h-[70vh] items-center justify-center">
            <Preloader />
          </div>
        }
      >
        <Routess>
          <Route path="/" element={<News key="general" category="general" />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routess>
      </Suspense>
    </>
  );
};

export default Routes;
