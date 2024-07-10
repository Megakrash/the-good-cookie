import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

function determineWsUrl() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost") {
      return "ws://localhost:5000/";
    } else if (hostname === "release-tgc.megakrash.fr") {
      return "wss://release-tgc.megakrash.fr/api";
    } else if (hostname === "tgc.megakrash.fr") {
      return "wss://tgc.megakrash.fr/api";
    }
  }
  return "wss://tgc.megakrash.fr/api";
}
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: determineWsUrl(),
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
