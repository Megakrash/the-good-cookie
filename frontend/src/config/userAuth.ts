import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { queryMeContext } from "@/graphql/users/queryMeContext";
import { UserContextTypes } from "@/types/UserTypes";

const isPrivateRoute = (pathname: string, privatePages: string[]) => {
  return privatePages.some((privatePage) => pathname.startsWith(privatePage));
};

export function useAuth(privatePages: string[]) {
  const { loading, data, refetch, error } = useQuery<{
    item: UserContextTypes;
  }>(queryMeContext);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (isPrivateRoute(router.pathname, privatePages)) {
        refetch();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router, refetch]);

  useEffect(() => {
    if (
      isPrivateRoute(router.pathname, privatePages) &&
      (data?.item === null || error)
    ) {
      localStorage.setItem("previousUrl", router.asPath);
      router.push("/signin");
    }
  }, [router, data, error]);

  return { loading };
}
