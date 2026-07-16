import { headers } from "next/headers";
import { auth } from "./auth";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return {
    isLoggedIn: !!session,
    token: session?.session.token,
    user: session?.user || null,
  };
};

export const getCurrentSession = async (token: string | undefined) => {
  const sessionList = await auth.api.listSessions({
    headers: await headers(),
  });
  return sessionList.find((session) => session.token == token);
};
