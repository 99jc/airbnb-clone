"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SiNaver, SiGoogle, SiApple, SiFacebook } from "react-icons/si";
import { ChevronLeft, Mail, Smartphone } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import SignUpWithPhoneNumberForm from "./SignUpWithPhoneNumberForm";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import clsx from "clsx";
import { searchAccountByEmail } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import SignUpWithCredentialForm from "./SignUpWithCredentialForm";
import SignInWithCredentialForm from "./SignInWithCredentialForm";

type FormType = "sign-in" | "sign-up" | "password";
type SignUpType = "phoneNumber" | "email";

const AuthForm = () => {
  const [formType, setFormType] = useState<FormType>("sign-in");
  const [signUpType, setSignUpType] = useState<SignUpType>("phoneNumber");

  const [formItemClicked, setFormItemClicked] = useState(false);
  const [email, setEmail] = useState("");

  const emailForm = useForm<z.infer<typeof searchAccountByEmail>>({
    resolver: zodResolver(searchAccountByEmail),
    defaultValues: {
      email: "",
    },
  });
  // 2. Define a submit handler.
  async function emailFormSubmit(values: z.infer<typeof searchAccountByEmail>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const search = await fetch(`http://localhost:3000/api/auth/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email }),
    });
    if (search.ok) {
      setEmail(values.email);
      setFormType("password");
    } else {
      if (search.status === 404) {
        setFormType("sign-up");
        setEmail(values.email);
      }
    }
  }

  const googleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 클라이언트에서 사용하려면 NEXT_PUBLIC_를 접두사로 붙여야됨
    const redirectUri = "http://localhost:3000/api/auth/google/callback"; // 백엔드 엔드포인트로 직접 연결
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

    window.location.href = googleAuthUrl;
  };
  return (
    <DialogContent className="w-[36rem] !rounded-[2rem] !px-0 !gap-0 overflow-hidden bg-white">
      <DialogHeader className="px-7 py-2 w-full h-7 justify-center items-center relative">
        {(formType === "sign-up" || formType === "password") && (
          <div className="absolute -top-1 left-5 z-20 size-8 bg-white">
            <Button
              type="button"
              className="rounded-full -top-1 left-5 z-20 size-8 bg-white shadow-none hover:bg-black/15"
              onClick={() => setFormType("sign-in")}
            >
              <ChevronLeft />
            </Button>
          </div>
        )}
        <DialogTitle>
          {formType === "sign-up" && "회원 가입 완료하기"}
          {formType === "sign-in" && "로그인 또는 회원가입"}
          {formType === "password" && "로그인"}
        </DialogTitle>
      </DialogHeader>
      {formType === "sign-in" && (
        <div className="w-full px-7 pt-10 h-[36rem] overflow-y-scroll">
          <h2 className="text-2xl">에어비엔비에 오신 것을 환영합니다.</h2>
          {signUpType === "phoneNumber" ? (
            <SignUpWithPhoneNumberForm />
          ) : (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(emailFormSubmit)}
                className="space-y-3"
              >
                <div className="mt-5 rounded-lg border border-black/25 flex flex-col">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem
                        className="relative"
                        onFocus={() => setFormItemClicked(true)}
                        onBlur={() => setFormItemClicked(false)}
                      >
                        <div className="absolute top-0 left-0 -z-10">
                          <div className="relative">
                            <p
                              className={clsx(
                                "absolute top-0 left-0 w-20 text-start transition-all duration-200 text-lg",
                                formItemClicked || field.value
                                  ? "scale-75"
                                  : "scale-100 translate-x-2 translate-y-3.5"
                              )}
                            >
                              이메일
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="w-full !text-base pt-5 h-14 border-none focus:!ring-2 focus:ring-black z-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-xs">
                  <p>
                    전화나 문자로 전화번호를 확인하겠습니다. 일반 문자 메시지
                    요금 및 데이터 요금이 부과됩니다.
                    <a href="#">개인정보 처리방침</a>
                  </p>
                </div>
                <Button
                  type="submit"
                  className="bg-black text-white w-full h-14"
                >
                  Submit
                </Button>
              </form>
            </Form>
          )}
          <div className="w-full h-14 flex flex-row items-center">
            <div className="w-[14rem] h-[1px] bg-black/15" />
            <p className="px-5 text-sm">또는</p>
            <div className="w-[14rem] h-[1px] bg-black/15" />
            <div />
          </div>
          <div className="w-full flex flex-col gap-2 mb-2">
            <Button
              type="submit"
              className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5"
              onClick={async () => {
                try {
                  const result = await fetch("http://localhost:3000/api");
                  if (result.ok) {
                    const r = await result.json();
                    console.log(r);
                  }
                } catch {}
              }}
            >
              <SiNaver className="absolute top-5 left-8 text-green-500 !size-4" />
              <p className="p-4">네이버로 로그인하기</p>
            </Button>
            <Button
              className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5"
              onClick={googleLogin}
            >
              <SiGoogle className="absolute top-4.5 left-7.5 !size-5" />
              <p className="p-4">구글로 로그인하기</p>
            </Button>
            <Button className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5">
              <SiApple className="absolute top-3.5 left-7 text-black !size-6" />
              <p className="p-4">애플로 로그인하기</p>
            </Button>
            {signUpType === "phoneNumber" ? (
              <Button
                onClick={() => setSignUpType("email")}
                className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5"
              >
                <Mail className="absolute top-3.5 left-7 text-black !size-6" />
                <p className="p-4">이메일로 로그인하기</p>
              </Button>
            ) : (
              <Button
                onClick={() => setSignUpType("phoneNumber")}
                className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5"
              >
                <Smartphone className="absolute top-3.5 left-7 text-black !size-6" />
                <p className="p-4">전화번호로 로그인하기</p>
              </Button>
            )}
            <Button className="w-full bg-white text-black border border-black h-14 rounded-md relative text-center cursor-pointer hover:bg-black/5">
              <SiFacebook className="absolute top-3.5 left-7 text-blue-500 !size-6" />
              <p className="p-4">페이스북으로 로그인하기</p>
            </Button>
          </div>
        </div>
      )}
      {formType === "sign-up" && (
        <div className="w-full px-7 pt-10 h-[36rem] overflow-y-scroll">
          <SignUpWithCredentialForm email={email} />
        </div>
      )}
      {formType === "password" && (
        <div className="w-full px-7 pt-10 h-[18rem]">
          <SignInWithCredentialForm email={email} />
        </div>
      )}
    </DialogContent>
  );
};

export default AuthForm;
