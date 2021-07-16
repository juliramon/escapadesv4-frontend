import { useEffect } from "react";
import Head from "next/head";

class AuthUtils {
  constructor() {}
  isUserAllowed = (user, router) => {
    useEffect(() => {
      if (!user || user === "null") {
        router.push("/login");
        return (
          <Head>
            <title>Carregant...</title>
          </Head>
        );
      } else {
        if (user) {
          if (user.accountCompleted === false) {
            router.push("/signup/complete-account");
          }
          if (user.hasConfirmedEmail === false) {
            router.push("/signup/confirmacio-correu");
          }
        }
      }
    }, [user]);
  };
}

export default AuthUtils;
