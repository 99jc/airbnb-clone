"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import HostingOverview from "./HostingOverview";
import { useRouter } from "next/navigation";
import AboutYourPlace from "./AboutYourPlace";
import Link from "next/link";
import TagForm from "./TagForm";
import RoomTypeForm from "./RoomTypeForm";
import AddressForm from "./AddressForm";

type submitButtonType = "prev" | "next";

interface Props {
  hostingId: string;
}

const BecomeAHostForm = ({ hostingId }: Props) => {
  const [formType, setFormType] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const formRefs = [
    useRef<{ submit: () => Promise<void> }>(null),
    useRef<{ submit: () => Promise<void> }>(null),
    useRef<{ submit: () => Promise<void> }>(null),
  ];

  const router = useRouter();

  const tagRef = useRef<HTMLDivElement | null>(null);

  const handleSubmitButton = (submitButtonType: submitButtonType) => {
    if (formType > 1) {
      formRefs[formType - 2].current?.submit();
    }
    if (submitButtonType === "prev") {
      setFormType((prev) => prev - 1);
    } else {
      setFormType((prev) => prev + 1);
    }
  };

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
  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white z-50">
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

        <div className={clsx("w-full h-[1px]", hasScrolled && "bg-black/10")} />
      </div>

      <div
        ref={tagRef}
        className="h-dvh w-full overflow-y-scroll scrollbar-hide"
      >
        {formType === 0 && <HostingOverview />}
        {formType === 1 && <AboutYourPlace />}
        {formType === 2 && <TagForm ref={formRefs[0]} hostingId={hostingId} />}
        {formType === 3 && (
          <RoomTypeForm ref={formRefs[1]} hostingId={hostingId} />
        )}
        {formType === 4 && (
          <AddressForm ref={formRefs[2]} hostingId={hostingId} />
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full h-24 bg-white z-50">
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
            onClick={() => handleSubmitButton("prev")}
            className="px-2 py-1 bg-white text-center text-black underline underline-offset-1 hover:bg-black/15 rounded-sm cursor-pointer disabled:opacity-0 disabled:cursor-default"
          >
            뒤로
          </button>
          {formType === 0 ? (
            <button
              className="px-8 py-3 bg-black text-center text-white rounded-sm cursor-pointer"
              onClick={() => handleSubmitButton("next")}
              type="button"
            >
              시작하기
            </button>
          ) : (
            <button
              className="px-8 py-3 bg-black text-center text-white rounded-sm cursor-pointer"
              onClick={() => handleSubmitButton("next")}
              type="button"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeAHostForm;
