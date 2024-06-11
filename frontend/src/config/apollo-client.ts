import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { API_URL } from "../api/configApi";

const httpLink = new HttpLink({
  uri: API_URL || "/api",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:5000/graphql`, // Use ws:// for local development
    connectionParams: {
      authToken: "yourAuthToken", // If you use authentication, pass the token here
    },
    on: {
      connected: () => console.log("Connected to WebSocket"),
      closed: (code, reason) =>
        console.log(`WebSocket closed: ${code}, ${reason}`),
      error: (error) => console.log("WebSocket error:", error),
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
