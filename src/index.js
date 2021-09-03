import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider } from "react-supabase";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "react-modal-hook";
import { Auth } from "@supabase/ui";

import { supabase } from "./supabase";
import App from "./App";
import "./index.css";

const authClient = supabase.auth;

const uri =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_GRAPHQL_URI
    : process.env.REACT_APP_DEV_GRAPHQL_URI;

/* Set URI for all Apollo GraphQL requests (backend api) */
const httpLink = new HttpLink({
  uri,
  fetchOptions: { credentials: "same-origin" },
});

/* Create Apollo Link to supply token */
const withTokenLink = setContext(() => {
  return { authToken: authClient.session()?.access_token };
});

/* Create Apollo Link to supply token in auth header with every gql request */
const authLink = setContext((_, { headers, authToken }) => ({
  headers: {
    ...headers,
    ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
  },
}));

/* Create Apollo Client */
const client = new ApolloClient({
  link: ApolloLink.from([withTokenLink, authLink, httpLink]),
  cache: new InMemoryCache({}),
});

/* Create root render function */
const renderApp = (Component) => {
  render(
    <Auth.UserContextProvider supabaseClient={supabase}>
      <ApolloProvider client={client}>
        <Provider value={supabase}>
          <BrowserRouter>
            <ModalProvider>
              <App />
            </ModalProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    </Auth.UserContextProvider>, 
    document.getElementById("root")
  );
};

renderApp(App);
