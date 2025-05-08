"use client";

import { hostingRoomType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefObject, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem } from "./ui/form";
import { DoorClosed, Home } from "lucide-react";
import clsx from "clsx";
import { editHosting } from "@/lib/auth";

interface Props {
  ref: RefObject<{ submit: () => void } | null>;
  hostingId: string;
}

type roomType = "EntireSpace" | "Room" | "SharedRoom";

const RoomTypeForm = ({ ref, hostingId }: Props) => {
  const [roomType, setRoomType] = useState<roomType>("EntireSpace");

  const form = useForm<z.infer<typeof hostingRoomType>>({
    resolver: zodResolver(hostingRoomType),
    defaultValues: {
      type: "EntireSpace",
    },
  });

  async function onSubmit(values: z.infer<typeof hostingRoomType>) {
    const result = await editHosting<typeof hostingRoomType>(
      hostingId,
      values,
      "roomType"
    );
    if (!result.result) {
      alert(result.message);
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () =>
      form.handleSubmit(async (values) => {
        await onSubmit(values);
      })(),
  }));
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={() => (
            <FormItem>
              <div className="w-full flex flex-col justify-center items-center py-32 gap-2">
                <h1 className="text-4xl w-full max-w-[40rem] pb-10">
                  게스트가 사용할 숙소 유형
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "EntireSpace");
                    setRoomType("EntireSpace");
                  }}
                  className={clsx(
                    "flex flex-row w-full max-w-[40rem] rounded-lg border-black/15 border-2 hover:!border-black",
                    roomType === "EntireSpace" && " !border-black bg-black/5"
                  )}
                >
                  <div className="flex w-full flex-row p-5 items-center justify-between">
                    <div className="text-start">
                      <h2 className="text-2xl">공간 전체</h2>
                      <p className="text-base text-black/50">
                        게스트가 숙소 전체를 단독으로 사용합니다.
                      </p>
                    </div>
                    <Home size={40} />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "Room");
                    setRoomType("Room");
                  }}
                  className={clsx(
                    "flex flex-row w-full max-w-[40rem] rounded-lg border-2 border-black/15 hover:!border-black",
                    roomType === "Room" && "!border-black bg-black/5"
                  )}
                >
                  <div className="flex w-full flex-row p-5 items-center justify-between">
                    <div className="text-start">
                      <h2 className="text-2xl pb-1">방</h2>
                      <p className="text-sm text-black/50 mr-32">
                        단독으로 사용하는 개인실이 있고, 공용 공간도 있는
                        형태입니다.
                      </p>
                    </div>
                    <DoorClosed size={40} />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "SharedRoom");
                    setRoomType("SharedRoom");
                  }}
                  className={clsx(
                    "flex flex-row w-full max-w-[40rem] rounded-lg  border-black/15 border-2 hover:!border-black",
                    roomType === "SharedRoom" && " !border-black bg-black/5"
                  )}
                >
                  <div className="flex w-full flex-row p-5 items-center justify-between">
                    <div className="text-start">
                      <h2 className="text-2xl mb-1">호스트 내 다인실</h2>
                      <p className="text-sm text-black/50 mr-32">
                        게스트는 연중무휴 직원이 상주하는 전문 숙박시설인 호스텔
                        내부 다인실에서 머무릅니다.
                      </p>
                    </div>
                    <Home size={40} />
                  </div>
                </button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default RoomTypeForm;
