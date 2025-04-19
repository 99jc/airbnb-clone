"use client";
import { signUpWithCredential } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import clsx from "clsx";
import { Button } from "./ui/button";
import { z } from "zod";
import { Input } from "./ui/input";
import { getYears } from "@/constants/Nav";
import { Checkbox } from "./ui/checkbox";
import { signIn } from "@/lib/auth";

interface Props {
  email: string;
}

interface Credential {
  email: string;
  password: string;
}

const SignUpWithCredentialForm = ({ email }: Props) => {
  const today = new Date();
  const [days, setDays] = useState<Array<number>>([]);
  const [selectedYearMonth, setSelectedYearMonth] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [formItemClicked, setFormItemClicked] = useState({
    first: false,
    second: false,
  });

  const monthes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const years = getYears();

  useEffect(() => {
    const lastDay = new Date(
      selectedYearMonth.year,
      selectedYearMonth.month,
      0
    ).getDate();
    setDays(Array.from({ length: lastDay }, (_, i) => i + 1));
  }, [selectedYearMonth]);

  const form = useForm<z.infer<typeof signUpWithCredential>>({
    resolver: zodResolver(signUpWithCredential),
    defaultValues: {
      name: "",
      familyName: "",
      email: email,
      password: "",
      birthYear: today.getFullYear(),
      birthDay: 1,
      birthMonth: today.getMonth() + 1,
      personalInformation: false,
      receiveEmail: false,
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpWithCredential>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const signUpRequest = await fetch(
      "http://localhost:3000/api/auth/signUp/credential",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    const result = (await signUpRequest.json()) as Credential;
    const signInRequest = await signIn(result.email, result.password);

    if (signInRequest.login) {
      window.location.href = "/";
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <h2 className="text-lg">실명</h2>
        <div className="mt-5 rounded-lg border border-black/25 flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="absolute top-0 left-0 px-3 py-2">
                  <p className="text-xs">신분증에 기재된 이름(예: 길동)</p>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-full !text-base pt-5 h-14 border-none focus:!ring-2 focus:ring-black z-0"
                    placeholder="신분증에 기재된 이름(예: 길동)"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            className={clsx(
              "w-full h-[1px]",
              formItemClicked.first || formItemClicked.second
                ? "bg-none"
                : "bg-black/25"
            )}
          />
          <FormField
            control={form.control}
            name="familyName"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="absolute top-0 left-0 px-3 py-2">
                  <p className="text-xs">신분증에 기재된 성(예: 홍)</p>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-full !text-base pt-5 h-14 border-none focus:!ring-2 focus:ring-black z-0"
                    placeholder="신분증에 기재된 성(예: 홍)"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="text-xs">
          <p>
            정부 발급 신분증에 기재된 이름과 일치해야 합니다. 평소 다른 이름을
            사용하는 경우, <a href="#">선호하는 이름</a>을 입력하세요.
          </p>
        </div>
        <h2 className="text-lg">생년월일</h2>
        <p className="text-sm">생일</p>
        <div className="flex w-full justify-between items-center">
          <FormField
            control={form.control}
            name="birthMonth"
            render={({ field }) => (
              <FormItem>
                <select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    setSelectedYearMonth((prev) => ({
                      ...prev,
                      month: Number(e.target.value),
                    }));
                  }}
                  className="w-[12rem] h-14 p-1 appearance-none border border-black/15 rounded-lg focus:outline-none focus:border-black relative"
                >
                  {monthes.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDay"
            render={({ field }) => (
              <FormItem>
                <select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    setSelectedYearMonth((prev) => ({
                      ...prev,
                      year: Number(e.target.value),
                    }));
                  }}
                  className="w-[7rem] h-14 p-1 appearance-none border border-black/15 rounded-lg focus:outline-none focus:border-black relative"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthYear"
            render={({ field }) => (
              <FormItem>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-[12rem] h-14 p-1 appearance-none border border-black/15 rounded-lg focus:outline-none focus:border-black relative"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
        </div>
        <h2 className="text-lg mt-5">연락처 정보</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem
              className="relative"
              onFocus={() =>
                setFormItemClicked((prev) => ({ ...prev, first: true }))
              }
              onBlur={() =>
                setFormItemClicked((prev) => ({ ...prev, first: false }))
              }
            >
              <div className="absolute top-0 left-0 -z-10">
                <div className="relative">
                  <p
                    className={clsx(
                      "absolute top-0 left-0 w-20 text-start transition-all duration-200 text-lg",
                      formItemClicked.first || field.value
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
                  type="text"
                  {...field}
                  className={clsx(
                    "w-full !text-base pt-5 h-14 border border-black/75 shadow-none focus:border-1 focus:border-black",
                    !field.value &&
                      !formItemClicked.first &&
                      "placeholder:text-black/0"
                  )}
                  placeholder="이메일"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <h2 className="text-lg mt-5">비밀번호</h2>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem
              className="relative"
              onFocus={() =>
                setFormItemClicked((prev) => ({ ...prev, second: true }))
              }
              onBlur={() =>
                setFormItemClicked((prev) => ({ ...prev, second: false }))
              }
            >
              <div className="absolute top-0 left-0 -z-10">
                <div className="relative">
                  <p
                    className={clsx(
                      "absolute top-0 left-0 w-20 text-start transition-all duration-200 text-lg",
                      formItemClicked.second || field.value
                        ? "scale-75"
                        : "scale-100 translate-x-2 translate-y-3.5"
                    )}
                  >
                    비밀번호
                  </p>
                </div>
              </div>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className={clsx(
                    "w-full !text-base pt-5 h-14 border border-black/75 shadow-none focus:border-1 focus:border-black",
                    !field.value &&
                      !formItemClicked.second &&
                      "placeholder:text-black/0"
                  )}
                  placeholder="비밀번호"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full h-[1px] bg-black/15" />
        <FormField
          control={form.control}
          name="personalInformation"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="w-full">
                  <div className="text-xs">
                    <h3>개인정보 수집 및 이용에 동의합니다.</h3>
                    <p>
                      1.에어비앤비가 수집하는 개인 정보 에어비앤비 플랫폼을
                      이용하는데 필요한 정보 당사는 회원님이 에어비앤비 플랫폼을
                      이용할때 회원님의 개인정보를 수집합니다. 그렇지 않은 경우,
                      에어비앤비는 요청하신 서비스를 회원님께 제공하지 못할 수
                      있습니다. 이러한 정보는에는 다음이 포함됩니다.
                    </p>
                  </div>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(check) => {
                      field.onChange(check === true);
                      if (check === true) {
                        setSubmitDisabled(false);
                      } else {
                        setSubmitDisabled(true);
                      }
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receiveEmail"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="w-full">
                  <div className="text-xs">
                    <h3>마케팅 이메일 수신을 원합니다(선택).</h3>
                    <p>
                      에어비앤비 회원 전용 할인, 추천 여행 정보, 마케팅 이메일,
                      푸시 알람을 보내드립니다. 계정 설정 또는 마케팅 알림에서
                      언제든지 수신을 거부할 수 있습니다.
                    </p>
                  </div>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-black text-white w-full h-14"
          disabled={submitDisabled}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUpWithCredentialForm;
