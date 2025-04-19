"use server";

import { User } from "@/types/type";
import { cookies } from "next/headers";

export const signIn = async (username: string, password: string) => {
  const request = await fetch("http://localhost:3000/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
    }),
    credentials: "include",
  });
  if (request.ok) {
    const setCookieHeader = request.headers.get("set-cookie");
    if (setCookieHeader) {
      // Next.js에서 쿠키 수동 설정
      (await cookies()).set(
        "access_token",
        setCookieHeader.split(";")[0].split("=")[1],
        {
          httpOnly: true,
          secure: false, // 개발용
          sameSite: "lax",
        }
      );
    }
    return { login: true, message: "login success" };
  } else {
    return { login: false, message: "login fail" };
  }
};

export const getAccount = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");
  const request = await fetch("http://localhost:3000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    credentials: "include",
  });

  if (request.ok) {
    const account = (await request.json()) as User;
    return { message: "account exist", account: account };
  } else {
    return { message: "account not exist", account: undefined };
  }
};

export const logout = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");
  const request = await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    credentials: "include",
  });

  if (request.ok) {
    (await cookies()).delete("access_token");
    return { message: "Logged out" };
  } else {
    return { message: "Error" };
  }
};
