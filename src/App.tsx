import React from "react";
import { Switch, Route } from "react-router-dom";

import { Header, Footer } from "./components";
import { Home } from "./app/index";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
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
