import React from "react";
import { Route, Routes } from "react-router-dom";

import { Header, Footer } from "./core-components";
import { Home } from "./app/index";

function App() {
  return (
    <div className="flex flex-col min-h-screen text-gray-50 bg-gradient-to-tr from-indigo-900 to-green-900">
      <Header />
      <div className="p-4 flex-grow flex flex-col h-full">
        <Routes>
          <Route path={"/"} element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
