import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";

const isPrivateRoute = (pathname: string, privatePages: string[]) => {
  return privatePages.some((privatePage) => pathname.startsWith(privatePage));
};

export function useAuth(privatePages: string[]) {
  const router = useRouter();
  const { user, refetchUserContext, loading } = useUserContext();
  useEffect(() => {
    const handleRouteChange = () => {
      if (isPrivateRoute(router.pathname, privatePages)) {
        refetchUserContext();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router, refetchUserContext]);

  useEffect(() => {
    if (isPrivateRoute(router.pathname, privatePages) && user === null) {
      localStorage.setItem("previousUrl", router.asPath);
      router.push("/signin");
    }
  }, [router, user]);

  return { loading };
}
