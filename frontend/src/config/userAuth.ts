import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { queryMeContext } from "@/graphql/Users";
import { UserContextTypes } from "@/types/UserTypes";

export function useAuth(privatePages: string[]) {
  const { loading, data, refetch } = useQuery<{ item: UserContextTypes }>(
    queryMeContext,
  );
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (privatePages.includes(router.pathname)) {
        refetch();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router, refetch]);

  useEffect(() => {
    if (privatePages.includes(router.pathname) && data?.item === null) {
      router.replace("/signin");
    }
  }, [router, data]);

  return { loading };
}
