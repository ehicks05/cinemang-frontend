import React from "react";
import { Switch, Route } from "react-router-dom";

import { Header, Footer } from "./components";
import { Home } from "./app/index";

function App() {
  return (
    <div className="flex flex-col min-h-screen text-gray-50 bg-gradient-to-tr from-indigo-900 to-green-900">
      <Header />
      <div className="p-4 flex-grow flex flex-col h-full">
        <Switch>
          <Route exact path={"/"} render={() => <Home />} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
