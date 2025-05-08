"use client";
import * as Icons from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tags } from "@/constants/Tag";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { tag } from "@/lib/schema";
import { ElementType, RefObject, useImperativeHandle, useState } from "react";
import clsx from "clsx";
import { editHosting } from "@/lib/auth";

interface Props {
  ref: RefObject<{ submit: () => void } | null>;
  hostingId: string;
}

const TagForm = ({ ref, hostingId }: Props) => {
  const [hostingTag, setHostingTag] = useState("");

  const form = useForm<z.infer<typeof tag>>({
    resolver: zodResolver(tag),
    defaultValues: {
      tag: "",
    },
  });

  async function onSubmit(values: z.infer<typeof tag>) {
    const result = await editHosting<typeof tag>(hostingId, values, "tag");
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
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="tag"
          render={() => (
            <FormItem>
              <div className="w-full flex flex-col justify-center items-center py-32">
                <h1 className="text-center text-4xl mb-10">
                  다음 중 숙소를 잘 설명하는 것은 무엇인가요?
                </h1>
                <div className="grid grid-rows-2 md:grid-cols-3 gap-4">
                  {Tags.map(({ label, icon }) => {
                    const Icon = Icons[
                      icon as keyof typeof Icons
                    ] as ElementType;
                    return (
                      <FormControl key={label}>
                        <button
                          type="button"
                          className={clsx(
                            "border-2 w-[13rem] border-black/10 rounded-md px-3 py-7 hover:border-black active:scale-90 hover:bg-black/5 transition-all duration-75",
                            hostingTag === label &&
                              "scale-105 !border-black !bg-black/5"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHostingTag(label);
                            form.setValue("tag", label);
                          }}
                        >
                          <Icon width={40} height={40} />
                          <p className="text-start">{label}</p>
                        </button>
                      </FormControl>
                    );
                  })}
                </div>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TagForm;
