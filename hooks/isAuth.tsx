"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { Box } from "@chakra-ui/react";
export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    useEffect(() => {
      if (!user && !loading) {
        router.push("/");
      }
    }, [user, loading]);

    if (!user && !loading) {
      return (
        <Box padding={20} alignItems={"center"}>
          <p className="text-center">login to use...</p>
        </Box>
      );
    }

    return <Component {...props} user={user} />;
  };
}
