"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/lib/auth";
import { User } from "@/types/type";
import clsx from "clsx";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  account: User;
}
const Nav2 = ({ account }: Props) => {
  const path = usePathname();
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-3 relative z-10 bg-white">
        <Link href="/">
          <Image
            src="/file.svg"
            alt="logo"
            width={50}
            height={50}
            className="w-[48px] h-[48px]"
          />
        </Link>
        <div className="flex flex-row gap-2 h-14 justify-between items-center">
          <Link
            href="#"
            className={clsx(
              "relative hover:bg-black/10 rounded-3xl",
              path === "/hosting" ? "hover:[&_div]:hidden" : "[&_div]:hidden"
            )}
          >
            <p className="px-4 py-2.5 text-sm">투데이</p>
            <div className="absolute top-[2.355rem] left-[38%] bg-black h-[2px] w-4 z-10"></div>
          </Link>
          <Link
            href="#"
            className={clsx(
              "relative hover:bg-black/10 rounded-3xl",
              path === "/calendar" ? "hover:[&_div]:hidden" : "[&_div]:hidden"
            )}
          >
            <p className="px-4 py-2.5 text-sm">달력</p>
            <div className="absolute top-[2.3rem] left-[38%] bg-black h-[2px] w-4 z-20"></div>
          </Link>
          <Link
            href="#"
            className={clsx(
              "relative hover:bg-black/10 rounded-3xl",
              path === "/listings" ? "hover:[&_div]:hidden" : "[&_div]:hidden"
            )}
          >
            <p className="px-4 py-2.5 text-sm">숙소</p>
            <div className="absolute top-[2.35rem] left-[38%] bg-black h-[2px] w-4 z-20"></div>
          </Link>
          <Link
            href="#"
            className={clsx(
              "relative hover:bg-black/10 rounded-3xl",
              path === "/message" ? "hover:[&_div]:hidden" : "[&_div]:hidden"
            )}
          >
            <p className="px-4 py-2.5 text-sm">메세지</p>
            <div className="absolute top-[2.35rem] left-[38%] bg-black h-[2px] w-4 z-20"></div>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex flex-row items-center justify-center px-4 py-2.5 hover:bg-black/10 rounded-3xl ">
                <p className="text-sm pl-1">메뉴</p>
                <ChevronDown size={20} />
              </div>
            </PopoverTrigger>
            <PopoverContent></PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-row items-center justify-between w-[7rem]">
          <Popover>
            <PopoverTrigger asChild>
              <div className="rounded-full border border-black/15 size-10 flex items-center justify-center hover:bg-black/5 cursor-pointer">
                <Bell />
              </div>
            </PopoverTrigger>
            <PopoverContent></PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <div className="rounded-full border border-black/5 cursor-pointer">
                <Image
                  src={account.picture!}
                  alt={account.name!}
                  width={40}
                  height={40}
                  className="p-[0.15rem] rounded-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[15rem] rounded-b-lg !px-0 py-2 border-none bg-white shadow-xl/20"
              align="end"
            >
              <div className="w-full h-full flex flex-col gap-1">
                <Link href="#">
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    프로필
                  </p>
                </Link>
                <Link href="#">
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    계정
                  </p>
                </Link>
                <Link href="#">
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    도움말 센터 방문하기
                  </p>
                </Link>
                <Link href="#">
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    안전 문제 관련 도움받기
                  </p>
                </Link>
                <div className="w-full h-[1px] my-1 bg-black/15" />
                <Link href="#">
                  <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                    언어 및 변역
                  </p>
                </Link>
                <Link href="#">
                  <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                    ₩ KRW
                  </p>
                </Link>
                <div className="w-full h-[1px] my-1 bg-black/15" />
                <Link href="#">
                  <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                    호스트 추천
                  </p>
                </Link>
                <Link href="#">
                  <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                    체험 호스팅하기
                  </p>
                </Link>
                <div className="w-full h-[1px] my-1 bg-black/15" />
                <Link href="#">
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    게스트 모드로 전환
                  </p>
                </Link>
                <button onClick={async () => logout()}>
                  <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                    로그아웃
                  </p>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full bg-black/10 h-[1px]" />
    </>
  );
};

export default Nav2;
