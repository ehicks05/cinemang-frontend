import React from "react";
import { render } from "react-dom";
import { Provider } from "react-supabase";
import { BrowserRouter } from "react-router-dom";

import { supabase } from "./supabase";
import App from "./App";
import "./index.css";

/* Create root render function */
const renderApp = (Component) => {
  render(
    <Provider value={supabase}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
};

renderApp(App);
