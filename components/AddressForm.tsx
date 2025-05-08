"use client";

import { RefObject, useImperativeHandle, useState } from "react";
import { Form, FormField, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editHosting } from "@/lib/auth";
import { address } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface Props {
  ref: RefObject<{ submit: () => void } | null>;
  hostingId: string;
}

type FormType = "search" | "detail";

const AddressForm = ({ ref, hostingId }: Props) => {
  const [formType, setFormType] = useState<FormType>("search");

  const form = useForm<z.infer<typeof address>>({
    resolver: zodResolver(address),
    defaultValues: {
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof address>) {
    const result = await editHosting<typeof address>(
      hostingId,
      values,
      "address"
    );
    if (!result.result) {
      alert(result.message);
    }
  }

  /*
    여기서 async () => onSubmit은 단순히 onSubmit 함수를 반환할 뿐,
    onSubmit(values)를 실행하지 않음 ❌
    form.handleSubmit(onSubmit)는 "새로운 함수" 를 리턴해주고
    그 뒤에 () 붙여줘야 실제 실행된다.
  */

  useImperativeHandle(ref, () => ({
    submit: () =>
      form.handleSubmit(async (values) => {
        await onSubmit(values);
      })(),
  }));
  return (
    <Form {...form}>
      <form className="space-y-8 z-0">
        <FormField
          control={form.control}
          name="address"
          render={() => (
            <FormItem>
              <div className="w-full flex flex-col justify-center items-center py-32 gap-2">
                <div className="w-full max-w-[40rem]">
                  <h1 className="text-4xl">숙소 위치는 어디인가요?</h1>
                  <p className="">
                    주소는 게스트의 예약이 확정된 이후에 공개됩니다.
                  </p>
                </div>
                <div className="w-[40rem] h-[40rem] rounded-lg relative">
                  <input className="absolute top-0 right-0"></input>
                </div>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddressForm;
