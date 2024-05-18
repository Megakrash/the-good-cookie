import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/UserContext";

export function useAuth(privatePages: string[]) {
  const router = useRouter();
  // Get user from context
  const { user, refetchUserContext } = useUserContext();
  // Refetch user context is the user is on a private page
  useEffect(() => {
    const handleRouteChange = () => {
      if (privatePages.includes(router.pathname)) {
        refetchUserContext();
      }
    };
    // Add event listener to handle route change
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router, refetchUserContext]);
  // Redirect to signin page if user is not logged in
  useEffect(() => {
    if (privatePages.includes(router.pathname) && user === null) {
      router.replace("/signin");
    }
  }, [router, user]);
  // Return user to _app.tsx
  return { user };
}
