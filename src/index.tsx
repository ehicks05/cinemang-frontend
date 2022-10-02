import React from "react";
import { render } from "react-dom";
import { Provider } from "react-supabase";
import { BrowserRouter } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { supabase } from "./supabase";
import App from "./App";
import { QUERY_PARAMS } from "./constants";
import "./index.css";

/* Create root render function */
const renderApp = () => {
  render(
    <Provider value={supabase}>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter} options={{params: QUERY_PARAMS, removeDefaultsFromUrl: true}}>
          <App />
        </QueryParamProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
};

renderApp();
