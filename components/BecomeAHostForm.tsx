"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tags } from "@/constants/Tag";
import Image from "next/image";
import * as Icons from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { hosting } from "@/lib/schema";
import { ElementType, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import HostingOverview from "./HostingOverview";
import { useRouter } from "next/navigation";
import AboutYourPlace from "./AboutYourPlace";
import Link from "next/link";

const BecomeAHostForm = () => {
  const [formType, setFormType] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const [tag, setTag] = useState("");
  const [privacyType, setPrivacyType] = useState("");

  const router = useRouter();

  const tagRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tagRef.current) {
        setHasScrolled(tagRef.current.scrollTop > 10);
      }
    };
    if (tagRef.current) {
      tagRef.current.addEventListener("scroll", handleScroll);
    }
    return () => tagRef!.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<z.infer<typeof hosting>>({
    resolver: zodResolver(hosting),
    defaultValues: {
      tag: "",
      type: "",
      address: "",
      image: [],
    },
  });
  function onSubmit(values: z.infer<typeof hosting>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="fixed top-0 left-0 w-full bg-white">
          <div
            className={clsx(
              "pt-10 px-12 flex flex-row justify-between items-center",
              formType > 0 && "pb-6"
            )}
          >
            <Link href="/">
              <Image src="/file.svg" alt="logo" width={40} height={40} />
            </Link>
            {formType > 0 ? (
              <div className="flex flex-row gap-5">
                <button
                  type="button"
                  className="bg-white border border-black/10 px-5 py-2 text-black rounded-2xl hover:bg-white hover:border-black"
                >
                  궁금하신 점이 있나요?
                </button>
                <button
                  type="submit"
                  className="bg-white border border-black/10 px-5 py-2 text-black rounded-2xl hover:bg-white hover:border-black"
                >
                  저장하고 나가기
                </button>
              </div>
            ) : (
              <button
                type="submit"
                onClick={() => {
                  router.push("/");
                }}
                className="py-2 px-5 border border-black/10 rounded-full hover:!border-black"
              >
                나가기
              </button>
            )}
          </div>

          <div
            className={clsx("w-full h-[1px]", hasScrolled && "bg-black/10")}
          />
        </div>

        <div
          ref={tagRef}
          className="h-dvh w-full overflow-y-scroll scrollbar-hide"
        >
          {formType === 0 && <HostingOverview />}
          {formType === 1 && <AboutYourPlace />}
          {formType === 2 && (
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
                                tag === label &&
                                  "scale-105 !border-black !bg-black/5"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTag(label);
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
          )}
          {formType === 3 && (
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
                      onClick={() => setPrivacyType("EntireSpace")}
                      className={clsx(
                        "flex flex-row w-full max-w-[40rem] rounded-lg border-black/15 border-2 hover:!border-black",
                        privacyType === "EntireSpace" &&
                          " !border-black bg-black/5"
                      )}
                    >
                      <div className="flex w-full flex-row p-5 items-center justify-between">
                        <div className="text-start">
                          <h2 className="text-2xl">공간 전체</h2>
                          <p className="text-base text-black/50">
                            게스트가 숙소 전체를 단독으로 사용합니다.
                          </p>
                        </div>
                        <Icons.Home size={40} />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacyType("Room")}
                      className={clsx(
                        "flex flex-row w-full max-w-[40rem] rounded-lg border-2 border-black/15 hover:!border-black",
                        privacyType === "Room" && "!border-black bg-black/5"
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
                        <Icons.DoorClosed size={40} />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacyType("SharedRoom")}
                      className={clsx(
                        "flex flex-row w-full max-w-[40rem] rounded-lg  border-black/15 border-2 hover:!border-black",
                        privacyType === "SharedRoom" &&
                          " !border-black bg-black/5"
                      )}
                    >
                      <div className="flex w-full flex-row p-5 items-center justify-between">
                        <div className="text-start">
                          <h2 className="text-2xl mb-1">호스트 내 다인실</h2>
                          <p className="text-sm text-black/50 mr-32">
                            게스트는 연중무휴 직원이 상주하는 전문 숙박시설인
                            호스텔 내부 다인실에서 머무릅니다.
                          </p>
                        </div>
                        <Icons.Home size={40} />
                      </div>
                    </button>
                  </div>
                </FormItem>
              )}
            />
          )}
          {formType === 4 && (
            <FormField
              control={form.control}
              name="address"
              render={() => (
                <FormItem>
                  <div className="w-full flex flex-col justify-center items-center py-32 gap-2">
                    <h1 className="text-4xl w-full max-w-[40rem]">
                      숙소 위치는 어디인가요?
                    </h1>
                    <p className="text-start text-xl text-black/50 w-full max-w-[40rem]">
                      주소는 게스트의 예약이 확정된 이후에 공개됩니다.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>
      </form>
      <div className="fixed bottom-0 left-0 w-full h-24 bg-white">
        <div
          className={clsx(
            "w-full h-[7px]",
            formType > 1 && "flex flex-row justify-between gap-2"
          )}
        >
          {formType > 1 ? (
            <>
              <div className="w-[33%] h-full bg-black/15"></div>
              <div className="w-[33%] h-full bg-black/15"></div>
              <div className="w-[33%] h-full bg-black/15"></div>
            </>
          ) : (
            <div className="w-full h-full bg-black/15" />
          )}
        </div>
        <div className="w-full h-full flex flex-row justify-between items-center px-14">
          <button
            disabled={formType === 0}
            type="button"
            onClick={() => setFormType((prev) => prev - 1)}
            className="px-2 py-1 bg-white text-center text-black underline underline-offset-1 hover:bg-black/15 rounded-sm cursor-pointer disabled:opacity-0 disabled:cursor-default"
          >
            뒤로
          </button>
          {formType === 0 ? (
            <button
              className="px-8 py-3 bg-black text-center text-white rounded-sm cursor-pointer"
              onClick={() => setFormType((prev) => prev + 1)}
              type="button"
            >
              시작하기
            </button>
          ) : (
            <button
              className="px-8 py-3 bg-black text-center text-white rounded-sm cursor-pointer"
              onClick={() => setFormType((prev) => prev + 1)}
              type="button"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </Form>
  );
};

export default BecomeAHostForm;
