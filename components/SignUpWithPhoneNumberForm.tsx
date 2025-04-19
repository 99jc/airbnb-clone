"use client";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { loginWithPhoneNumberSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { country } from "@/constants/Nav";
import clsx from "clsx";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SignUpWithPhoneNumberForm = () => {
  const [formItemClicked, setFormItemClicked] = useState({
    first: false,
    second: false,
  });
  const [contryNum, setContryNum] = useState(242);
  const form = useForm<z.infer<typeof loginWithPhoneNumberSchema>>({
    resolver: zodResolver(loginWithPhoneNumberSchema),
    defaultValues: {
      country: 0,
      phoneNumber: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginWithPhoneNumberSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="mt-5 rounded-lg border border-black/25 flex flex-col">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="absolute top-0 left-0 -z-10">
                  <p className="text-xs px-2 py-1">국가/지역</p>
                </div>
                <select
                  onFocus={() =>
                    setFormItemClicked((prev) => ({ ...prev, first: true }))
                  }
                  onBlur={() =>
                    setFormItemClicked((prev) => ({
                      ...prev,
                      first: false,
                    }))
                  }
                  onChange={(e) => {
                    setContryNum(Number(e.target.value));
                    field.onChange(Number(e.target.value));
                  }}
                  value={field.value}
                  className="w-full h-14 px-2 pt-4 appearance-none rounded-lg focus:outline-none focus:ring-2 focus:ring-black relative"
                >
                  {country.map((item) => (
                    <option key={item.name} value={item.number}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
            name="phoneNumber"
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
                      전화번호
                    </p>
                  </div>
                  <p
                    className={clsx(
                      "text-base mt-6 ml-2",
                      !formItemClicked.second && !field.value && "hidden"
                    )}
                  >
                    {"+" + contryNum.toString()}
                  </p>
                </div>
                <FormControl>
                  <Input
                    type="tel"
                    {...field}
                    className="w-full !text-base pt-5 h-14 border-none focus:!ring-2 focus:ring-black z-0"
                    style={{
                      paddingLeft: `${
                        contryNum.toString().length > 2
                          ? contryNum.toString().length * 1.1
                          : contryNum.toString().length * 1.4
                      }rem`,
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="text-xs">
          <p>
            전화나 문자로 전화번호를 확인하겠습니다. 일반 문자 메시지 요금 및
            데이터 요금이 부과됩니다.
            <a href="#">개인정보 처리방침</a>
          </p>
        </div>
        <Button type="submit" className="bg-black text-white w-full h-14">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUpWithPhoneNumberForm;
