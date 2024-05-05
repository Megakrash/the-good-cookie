import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { API_URL } from "../api/configApi";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: API_URL || "http://localhost:5000/",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
