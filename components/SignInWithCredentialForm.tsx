"use client";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { signInWithIdPassword } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import clsx from "clsx";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "@/lib/auth";

interface Props {
  email: string;
}
const SignInWithCredentialForm = ({ email }: Props) => {
  const [formItemClicked, setFormItemClicked] = useState(false);
  const credentialForm = useForm<z.infer<typeof signInWithIdPassword>>({
    resolver: zodResolver(signInWithIdPassword),
    defaultValues: {
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signInWithIdPassword>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const signInRequest = await signIn(email, values.password);
    if (signInRequest.login) {
      window.location.href = "/";
    } else {
      alert(signInRequest.message);
    }
  }
  return (
    <Form {...credentialForm}>
      <form
        onSubmit={credentialForm.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <div className="mt-5 rounded-lg border border-black/25 flex flex-col">
          <FormField
            control={credentialForm.control}
            name="password"
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
                      비밀번호
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="w-full !text-base pt-5 h-14 border-none focus:!ring-2 focus:ring-black z-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="bg-black text-white w-full h-14">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignInWithCredentialForm;
