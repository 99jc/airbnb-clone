"use server";

import { NewHosting, User } from "@/types/type";
import { cookies } from "next/headers";
import { z } from "zod";

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

export const createHosting = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");
  const request = await fetch("http://localhost:3000/api/hosting/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    credentials: "include",
  });

  if (request.ok) {
    const hosting = (await request.json()) as unknown as NewHosting;
    return { message: "create hosting success", hostingId: hosting.hostingId };
  } else {
    return { message: "fail create hosting", hostingId: undefined };
  }
};

type editHostingType = "tag" | "roomType" | "address";

export const editHosting = async <T extends z.ZodType>(
  hostingId: string,
  data: z.infer<T>,
  type: editHostingType
) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");
  console.log(data);
  const request = await fetch(
    `http://localhost:3000/api/hosting/${hostingId}/${type}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );
  if (request.ok) {
    return { message: `edit ${type} success`, result: true };
  } else {
    return { message: `edit ${type} fail`, result: false };
  }
};
