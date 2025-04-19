"use client";
import Image from "next/image";
import Bar from "./Bar";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { searchSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import SearchBarItem from "./SearchBarItem";
import SearchBarTrigger from "./SearchBarTrigger";
import SearchBarContent from "./SearchBarContent";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import FormLengthBar from "./FormLengthBar";
import { CalendarIcon, Menu, Search, UserCircle2 } from "lucide-react";
import { getMonth, NavMenu, SubNavMenu } from "@/constants/Nav";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBarCategory from "./SearchBarCategory";
import AuthForm from "./AuthForm";
import { User } from "@/types/type";
import { logout } from "@/lib/auth";

type reservationType = "Stays" | "Experience";
type dateType = "SelectDate" | "Month" | "flexible";
type flexDateType = "Weekend" | "Week" | "Month";

interface Props {
  autoSpreadMode: boolean;
  account?: User;
}

const Nav = ({ autoSpreadMode, account }: Props) => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchType, setSearchType] = useState<reservationType>("Stays");
  const [spotName, setSpotName] = useState<string | undefined>("");
  const [hoverNum, setHoverNum] = useState(0);
  const [num, setNum] = useState(0);
  const [smallNavBarClicked, setSmallNavBarClicked] = useState(false);
  const [dateType, setDateType] = useState<dateType>("SelectDate");
  const [marginOfDate, setMarginOfDate] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(!autoSpreadMode);
  const [flexibleDateType, setFlexibleDateType] =
    useState<flexDateType>("Week");
  const [flexibleDateMonth, setFlexibleDateMonth] = useState<Set<number>>(
    new Set<number>()
  );

  const [checkInOut, setCheckInOut] = useState<{
    checkIn: Date | undefined;
    checkOut: Date | undefined;
  }>({
    checkIn: undefined,
    checkOut: undefined,
  });

  const [people, setPeople] = useState({
    adult: 0,
    child: 0,
    baby: 0,
    pet: 0,
  });
  const [subNavNum, setSubNavNum] = useState(0);

  const typeButtonRef = useRef<HTMLDivElement | null>(null);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const smallNavBarRef = useRef<HTMLDivElement | null>(null);
  const spotCategoryRef = useRef<HTMLDivElement | null>(null);
  const flexibleDateCategoryRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
      if (window.scrollY > 32 && searchBarVisible) {
        setSearchBarVisible(false);
      }
    };
    if (autoSpreadMode && !searchBarVisible) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [autoSpreadMode, searchBarVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchBarRef.current?.contains(target) ||
        typeButtonRef.current?.contains(target)
      ) {
        return;
      }
      setSearchBarVisible(false);
      setNum(0);
    };
    if (num !== 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [autoSpreadMode, num]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (smallNavBarRef.current?.contains(target)) {
        return;
      }
      setSmallNavBarClicked(false);
    };
    if (smallNavBarClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [smallNavBarClicked]);

  const searchBarForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      spotName: undefined,
      date: {
        checkIn: undefined,
        checkOut: undefined,
        marginOfDate: undefined,
      },
      flexibleMonth: [],
      people: {
        adult: 0,
        child: 0,
        baby: 0,
        pet: 0,
      },
    },
  });

  // 2. Define a submit handler.
  function searchBarSubmit(values: z.infer<typeof searchSchema>) {
    console.log(values);
    /*
    const {
      spotName,
      date: { checkIn, checkOut },
      people: { adult, child, baby, pet },
    } = values;

    /*
    if (spotName === undefined) {
      router.push(
        `/?checkIn=${checkIn}&checkOut=${checkOut}&adult=${adult}&child=${child}&baby=${baby}&pet=${pet}&flexible=${marginOfDate}`
      );
    } else {
      router.push(
        `/s/${spotName}?checkIn=${checkIn}&checkOut=${checkOut}&adult=${adult}&child=${child}&baby=${baby}&pet=${pet}&flexible=${marginOfDate}`
      );
    }
    */
  }

  const dateFormat = (date: Date) => {
    const margin = marginOfDate === 0 ? "" : ` ±${marginOfDate}`;
    return date.getMonth() + 1 + "월 " + date.getDate() + "일" + margin;
  };

  const guestFormat = () => {
    const { adult, child, baby, pet } = people;
    const adultAndChildrenCount = adult + child;
    let guest = `게스트 ${adultAndChildrenCount}명`;

    if (baby !== 0) {
      guest += `,유아 ${baby}명`;
    }

    if (pet !== 0) {
      guest += `,반려동물 ${pet}마리`;
    }
    return guest;
  };

  return (
    <header
      className={clsx(
        "w-full min-h-[5rem]",
        hasScrolled ? "fixed top-0 left-0" : "relative"
      )}
    >
      <div className="hidden md:flex md:flex-row items-start justify-between py-5 px-6 lg:px-10 xl:px-20 relative z-10 bg-white">
        <button
          onClick={() => router.push("/")}
          className="flex flex-row items-center justify-center min-h-[48px] min-w-[48px] z-50"
        >
          <Image
            src="/file.svg"
            alt="logo"
            width={50}
            height={50}
            className="w-[48px] h-[48px] mx-2"
          />
          <p className="text-[25px] hidden lg:block">airbnb</p>
        </button>
        <div
          className={clsx(
            "flex flex-1 h-[48px] items-center justify-center transition-all duration-200",
            (searchBarVisible || !hasScrolled) && "!h-[148px] max-lg:!h-[208px]"
          )}
        >
          <div
            ref={smallNavBarRef}
            className={clsx(
              "transform ease-in-out flex flex-row items-center pl-6 gap-2 justify-between w-[23rem] h-[48px] overflow-hidden bg-white border border-black/10 shadow-md shadow-black/15 rounded-full lg:ml-15 xl:ml-40 max-md:w-[65%] max-lg:w-[70%]",
              searchBarVisible || !hasScrolled
                ? "translate-y-[65px] translate-x-[120px] lg:translate-y-[35px] lg:translate-x-[40px] scale-150 !w-full duration-200 z-40 opacity-0"
                : "duration-200 z-50"
            )}
          >
            <p
              onClick={() => {
                setSmallNavBarClicked(true);
                setSearchBarVisible(true);
                setNum(1);
              }}
              className="truncate cursor-pointer"
            >
              어디든지
            </p>
            <div className="h-[60%] py-2 w-[1.5px] bg-black/15" />
            <p
              onClick={() => {
                setSmallNavBarClicked(true);
                setSearchBarVisible(true);
                setNum(2);
              }}
              className="truncate cursor-pointer"
            >
              언제든 일주일
            </p>
            <div className="h-[60%] py-2 w-[1.5px] bg-black/15" />
            <p
              onClick={() => {
                setSmallNavBarClicked(true);
                setSearchBarVisible(true);
                setNum(4);
              }}
              className="truncate cursor-pointer"
            >
              게스트 추가
            </p>
            <div
              className="size-9 mr-1 bg-black rounded-full items-center justify-center p-2"
              onClick={() => setSearchBarVisible(true)}
            >
              <Search className="size-5 text-white" />
            </div>
          </div>
          <div
            className={clsx(
              "transform absolute flex flex-col max-lg:top-16 top-0 left-0 w-full px-10 items-center justify-center ease-in-out",
              searchBarVisible || !hasScrolled
                ? "duration-200 z-40"
                : "scale-50 max-lg:-translate-x-[120px] -translate-y-[108px] lg:-translate-y-[68px] opacity-0 duration-200 z-40"
            )}
          >
            <div className="flex flex-col w-full h-[146px] mx-3">
              <div
                className={clsx(
                  "flex flex-row gap-1 h-20 mb-7 mt-6 w-full text-xl items-center justify-center text-center"
                )}
              >
                <div ref={typeButtonRef}>
                  <button
                    onClick={() => {
                      setSearchType("Stays");
                    }}
                    className={clsx(
                      "h-[44px] w-[52px] text-[16px] inline-block p-2 rounded-3xl",
                      searchType === "Stays"
                        ? "text-black"
                        : "text-slate-700 hover:bg-black/10"
                    )}
                  >
                    숙소
                  </button>
                  <button
                    onClick={() => {
                      setSearchType("Experience");
                      if (num === 3) {
                        setNum(2);
                      }
                    }}
                    className={clsx(
                      "h-[44px] w-[52px] text-[16px] inline-block p-2 rounded-3xl",
                      searchType !== "Stays"
                        ? "text-black"
                        : "text-slate-700 hover:bg-black/10"
                    )}
                  >
                    체험
                  </button>
                </div>
              </div>
              <Form {...searchBarForm}>
                <form
                  onSubmit={searchBarForm.handleSubmit(searchBarSubmit)}
                  className="flex w-full h-[66px] items-center justify-center"
                >
                  <div
                    ref={searchBarRef}
                    className={clsx(
                      "w-full max-w-[56rem] h-[66px] bg-white border border-black/10 shadow-md shadow-black/15 rounded-full relative",
                      num !== 0 && "!bg-slate-400"
                    )}
                  >
                    <div className="flex flex-row w-full h-full items-center justify-between relative">
                      <FormField
                        control={searchBarForm.control}
                        name="spotName"
                        render={({ field }) => (
                          <FormItem
                            className={clsx(
                              "w-[32%] h-full",
                              num === 1 && "!w-[16%]",
                              num === 2 && "!w-[42%] max-lg:!w-[44%]"
                            )}
                          >
                            <SearchBarItem
                              index={1}
                              smallBarClicked={smallNavBarClicked}
                              isInput={true}
                              prevPos={num}
                              safeAreaRef={typeButtonRef}
                            >
                              <SearchBarTrigger
                                onMouseDown={() => setNum(1)}
                                onMouseEnter={() => setHoverNum(1)}
                                onMouseLeave={() => setHoverNum(0)}
                                className={clsx(
                                  "flex flex-row gap-0 cursor-pointer w-full h-full rounded-full bg-white hover:bg-black/20 items-start justify-center px-6",
                                  num === 1 &&
                                    "shadow-xl hover:!bg-white absolute top-0 left-0 !w-[32%] max-lg:!w-[31.95%]",
                                  num !== 1 &&
                                    num !== 0 &&
                                    "!bg-slate-400 hover:!bg-slate-500"
                                )}
                              >
                                <div className="flex flex-col gap-0 py-[0.8rem] w-full h-full">
                                  <FormLabel className="text-xs cursor-pointer">
                                    여행지
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="여행지 검색"
                                      {...field}
                                      value={spotName}
                                      onChangeCapture={(e) => {
                                        e.stopPropagation();
                                        setSpotName(e.currentTarget.value);
                                      }}
                                      className="!h-7 p-0 !text-[1rem] focus-visible:!ring-0 border-none text-sm shadow-none"
                                    />
                                  </FormControl>
                                </div>
                                <div className="flex w-6 h-full items-center justify-center py-5">
                                  <button
                                    type="button"
                                    className={clsx(
                                      "rounded-full size-6 text-center hover:bg-black/25",
                                      (!field.value || num !== 1) && "hidden"
                                    )}
                                    onClick={() => {
                                      setSpotName("");
                                      searchBarForm.setValue("spotName", "");
                                    }}
                                  >
                                    x
                                  </button>
                                </div>
                              </SearchBarTrigger>
                              <SearchBarContent className="absolute top-20 left-0 w-[31rem] h-[33rem] py-10 rounded-[2rem] bg-white shadow-lg z-50">
                                <div className="overflow-scroll px-10 w-full h-full">
                                  <h2>지역으로 검색하기</h2>
                                  <div className="flex mt-6 flex-row gap-2">
                                    {NavMenu.area.map((item) => (
                                      <button
                                        type="button"
                                        key={item.word}
                                        className="rounded-md p-3 hover:bg-slate-300"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSpotName(
                                            item.word === "" ? "" : item.title
                                          );
                                          searchBarForm.setValue(
                                            "spotName",
                                            item.word
                                          );
                                        }}
                                      >
                                        <Image
                                          src={item.image!}
                                          alt={item.word}
                                          width={80}
                                          height={80}
                                          className="rounded-md border border-slate-200"
                                        />
                                        <p className="mt-2 text-sm text-start">
                                          {item.title}
                                        </p>
                                      </button>
                                    ))}
                                  </div>
                                  <h2 className="mt-8 mb-6">한국</h2>
                                  <div className="grid grid-cols-4 grid-row-4 gap-2">
                                    {NavMenu.korea.map((item) => (
                                      <button
                                        type="button"
                                        key={item.word}
                                        className="border border-slate-200 rounded-3xl hover:border-black text-center justify-center py-2 overflow-hidden"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSpotName(item.title);
                                          searchBarForm.setValue(
                                            "spotName",
                                            item.word
                                          );
                                        }}
                                      >
                                        {item.title}
                                      </button>
                                    ))}
                                  </div>
                                  <SearchBarCategory
                                    categoryRef={spotCategoryRef}
                                    active={num === 1}
                                    classNames={{
                                      parent:
                                        "mt-8 w-full h-[4.1rem] items-center",
                                      leftButton:
                                        "top-3 -left-5 size-14 p-[0.9rem] items-center justify-center z-20 bg-[linear-gradient(to_left,transparent_20%,white_50%)] cursor-pointer",
                                      rightButton:
                                        "top-3 -right-5 size-14 p-[0.9rem] items-center justify-center z-20 bg-[linear-gradient(to_right,transparent_20%,white_50%)] cursor-pointer",
                                      content: "w-full h-full",
                                    }}
                                  >
                                    <div className="flex w-[29rem] h-full items-center">
                                      {SubNavMenu.map((item, index) => (
                                        <div key={index}>
                                          <div className="px-3 relative mx-1">
                                            <div
                                              className="absolute top-0 left-0 py-2 px-3 rounded-md hover:bg-black/25 cursor-pointer"
                                              onClick={() =>
                                                setSubNavNum(index)
                                              }
                                            >
                                              <p className="text-nowrap w-full h-full">
                                                {item.title}
                                              </p>
                                            </div>
                                            <p className="text-nowrap w-full h-full my-5 rounded-md text-white z-0">
                                              {item.title}
                                            </p>
                                            <div
                                              className={clsx(
                                                "w-full h-[2px]",
                                                subNavNum === index
                                                  ? "bg-black"
                                                  : "bg-white"
                                              )}
                                            />
                                          </div>
                                          <div className="w-full h-[2px] bg-black/25" />
                                        </div>
                                      ))}
                                    </div>
                                  </SearchBarCategory>
                                  <div className="mt-5 grid grid-cols-4 grid-row-4 gap-2">
                                    {SubNavMenu[subNavNum].inventory.map(
                                      (item) => (
                                        <button
                                          type="button"
                                          key={item.word}
                                          className="border border-slate-200 rounded-3xl hover:border-black text-center justify-center py-2 px-1 truncate"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSpotName(item.title);
                                            searchBarForm.setValue(
                                              "spotName",
                                              item.word
                                            );
                                          }}
                                        >
                                          {item.title}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </SearchBarContent>
                            </SearchBarItem>
                          </FormItem>
                        )}
                      />
                      <FormLengthBar
                        className={clsx(
                          (hoverNum === 1 || hoverNum === 2) && "!bg-black/0"
                        )}
                      />
                      <FormField
                        control={searchBarForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem
                            className={clsx(
                              "w-[36%] h-full",
                              (num === 1 || num === 4) && "!w-[52%]",
                              (num === 2 || num === 3) &&
                                "!w-[26%] max-lg:!w-[24%]"
                            )}
                          >
                            <FormControl>
                              <SearchBarItem
                                index={2}
                                smallBarClicked={smallNavBarClicked}
                                isInput={false}
                                prevPos={num}
                                safeAreaRef={typeButtonRef}
                              >
                                {dateType === "SelectDate" &&
                                  searchType === "Stays" && (
                                    <SearchBarTrigger
                                      onMouseDown={() => setNum(2)}
                                      onMouseEnter={() => setHoverNum(2)}
                                      onMouseLeave={() => setHoverNum(0)}
                                      className={clsx(
                                        "flex flex-row cursor-pointer w-[50%] h-full rounded-full bg-white hover:bg-black/20 items-start justify-center px-6",
                                        num === 1 &&
                                          "lg:pl-[35.9%] checkInTrigger !w-[65.35%]",
                                        num === 2 &&
                                          "shadow-xl hover:!bg-white absolute top-0 left-[32%] !w-[18%]",
                                        num === 3 && "!w-full",
                                        num === 4 && "!w-[34.65%]",
                                        num !== 2 &&
                                          num !== 0 &&
                                          "!bg-slate-400 hover:!bg-slate-500"
                                      )}
                                    >
                                      <div className="flex flex-col gap-0 py-[0.8rem] w-full h-full">
                                        <FormLabel className="text-xs">
                                          체크인
                                        </FormLabel>
                                        <p className="text-sm">
                                          {checkInOut.checkIn
                                            ? dateFormat(checkInOut.checkIn)
                                            : "날짜 추가"}
                                        </p>
                                      </div>
                                      <div className="flex w-6 h-full items-center justify-center py-5">
                                        <button
                                          type="button"
                                          className={clsx(
                                            "rounded-full size-6 text-center hover:bg-black/25",
                                            (!field.value.checkIn ||
                                              num !== 2) &&
                                              "hidden"
                                          )}
                                          onClick={() => {
                                            field.value.checkIn = undefined;
                                            setCheckInOut((prev) => ({
                                              ...prev,
                                              checkIn: undefined,
                                            }));
                                            searchBarForm.setValue(
                                              "date.checkIn",
                                              undefined
                                            );
                                          }}
                                        >
                                          x
                                        </button>
                                      </div>
                                    </SearchBarTrigger>
                                  )}
                                {dateType === "SelectDate" &&
                                  searchType === "Stays" && (
                                    <FormLengthBar
                                      className={clsx(
                                        "mt-[0.63rem]",
                                        (hoverNum === 2 || hoverNum === 3) &&
                                          "!bg-black/0"
                                      )}
                                    />
                                  )}
                                {dateType === "SelectDate" &&
                                  searchType === "Stays" && (
                                    <SearchBarTrigger
                                      onMouseDown={() => setNum(3)}
                                      onMouseEnter={() => setHoverNum(3)}
                                      onMouseLeave={() => setHoverNum(0)}
                                      className={clsx(
                                        "flex flex-row cursor-pointer w-[50%] h-full rounded-full bg-white hover:bg-black/20 items-start justify-center px-6",
                                        num === 1 && "!w-[34.65%]",
                                        num === 2 &&
                                          "!w-full lg:pl-[40.85%] checkOutTrigger",
                                        num === 3 &&
                                          "shadow-xl hover:!bg-white absolute top-0 left-[50%] !w-[18%]",
                                        num === 4 && "!w-[65.35%]",
                                        num !== 3 &&
                                          num !== 0 &&
                                          "!bg-slate-400 hover:!bg-slate-500"
                                      )}
                                    >
                                      <div className="flex flex-col gap-0 py-[0.8rem] w-full h-full">
                                        <FormLabel className="text-xs">
                                          체크아웃
                                        </FormLabel>
                                        <p className="text-sm">
                                          {checkInOut.checkOut
                                            ? dateFormat(checkInOut.checkOut)
                                            : "날짜 추가"}
                                        </p>
                                      </div>
                                      <div className="flex w-6 h-full items-center justify-center py-5">
                                        <button
                                          type="button"
                                          className={clsx(
                                            "rounded-full size-6 text-center hover:bg-black/25",
                                            (!field.value.checkOut ||
                                              num !== 3) &&
                                              "hidden"
                                          )}
                                          onClick={() => {
                                            field.value.checkOut = undefined;
                                            setCheckInOut((prev) => ({
                                              ...prev,
                                              checkOut: undefined,
                                            }));
                                            searchBarForm.setValue(
                                              "date.checkOut",
                                              undefined
                                            );
                                          }}
                                        >
                                          x
                                        </button>
                                      </div>
                                    </SearchBarTrigger>
                                  )}
                                {((searchType === "Stays" &&
                                  dateType !== "SelectDate") ||
                                  searchType === "Experience") && (
                                  <SearchBarTrigger
                                    onMouseDown={() => setNum(2)}
                                    onMouseEnter={() => setHoverNum(2)}
                                    onMouseLeave={() => setHoverNum(0)}
                                    className={clsx(
                                      "flex flex-row cursor-pointer w-full h-full rounded-full bg-white hover:bg-black/20 items-start justify-center px-6",
                                      num === 1 &&
                                        "!w-full lg:pl-[35.95%] selectDateTrigger",
                                      num === 2 &&
                                        "shadow-xl hover:!bg-white absolute top-0 left-[32%] !w-[36%]",
                                      num === 4 && "!w-full",
                                      num !== 2 &&
                                        num !== 0 &&
                                        "!bg-slate-400 hover:!bg-slate-500"
                                    )}
                                  >
                                    <div className="flex flex-col gap-0 py-[0.8rem] w-full h-full">
                                      <FormLabel className="text-xs">
                                        날짜
                                      </FormLabel>
                                      <p className="text-sm">
                                        {checkInOut.checkOut
                                          ? dateFormat(checkInOut.checkOut)
                                          : "날짜 추가"}
                                      </p>
                                    </div>
                                    <div className="flex w-6 h-full items-center justify-center py-5">
                                      <button
                                        type="button"
                                        className={clsx(
                                          "rounded-full size-6 text-center hover:bg-black/25",
                                          (!field.value.checkOut ||
                                            num !== 2) &&
                                            "hidden"
                                        )}
                                        onClick={() => {
                                          field.value.checkOut = undefined;
                                          setCheckInOut(() => ({
                                            checkIn: undefined,
                                            checkOut: undefined,
                                          }));
                                          searchBarForm.setValue(
                                            "date.checkOut",
                                            undefined
                                          );
                                        }}
                                      >
                                        x
                                      </button>
                                    </div>
                                  </SearchBarTrigger>
                                )}
                                <SearchBarContent className="absolute top-20 left-0 w-full h-[33rem] rounded-[2rem] py-9 bg-white shadow-lg z-50">
                                  {searchType === "Stays" && (
                                    <div className="items-center justify-center w-full h-[29rem] px-8 overflow-scroll">
                                      <div className="flex h-[3.5rem] items-center justify-center w-full">
                                        <div className="flex flex-row gap-2 w-[20rem] h-[3rem] bg-gray-400 rounded-full p-1">
                                          <button
                                            type="button"
                                            className={clsx(
                                              "w-[33%] h-full rounded-full",
                                              dateType === "SelectDate" &&
                                                "bg-white border border-black/25",
                                              dateType !== "SelectDate" &&
                                                "hover:bg-black/25"
                                            )}
                                            onClick={() =>
                                              setDateType("SelectDate")
                                            }
                                          >
                                            날짜 지정
                                          </button>
                                          <button
                                            type="button"
                                            className={clsx(
                                              "w-[33%] h-full rounded-full",
                                              dateType === "Month" &&
                                                "bg-white border border-black/25",
                                              dateType !== "Month" &&
                                                "hover:bg-black/25"
                                            )}
                                            onClick={() => {
                                              setDateType("Month");
                                              setNum(2);
                                            }}
                                          >
                                            월 단위
                                          </button>
                                          <button
                                            type="button"
                                            className={clsx(
                                              "w-[33%] h-full rounded-full",
                                              dateType === "flexible" &&
                                                "bg-white border border-black/25",
                                              dateType !== "flexible" &&
                                                "hover:bg-black/25"
                                            )}
                                            onClick={() => {
                                              setDateType("flexible");
                                              setNum(2);
                                            }}
                                          >
                                            유연한 일정
                                          </button>
                                        </div>
                                      </div>
                                      {dateType === "SelectDate" && (
                                        <>
                                          <div className="w-full my-5 px-10">
                                            <Calendar
                                              className="w-full h-full flex"
                                              classNames={{
                                                months:
                                                  "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                                                month:
                                                  "space-y-4 w-full flex flex-col",
                                                table:
                                                  "w-full h-full border-collapse space-y-1",
                                                head_row: "",
                                                row: "w-full mt-2",
                                              }}
                                              mode="range"
                                              fromMonth={today}
                                              initialFocus
                                              disabled={{ before: today }}
                                              defaultMonth={today}
                                              selected={{
                                                from: field.value.checkIn,
                                                to: field.value.checkOut,
                                              }}
                                              onSelect={(
                                                range: DateRange | undefined
                                              ) => {
                                                const { checkIn, checkOut } =
                                                  field.value;
                                                if (num === 2) {
                                                  searchBarForm.setValue(
                                                    "date",
                                                    {
                                                      checkIn: range?.from,
                                                      checkOut,
                                                    }
                                                  );
                                                  setCheckInOut((prev) => ({
                                                    ...prev,
                                                    checkIn: range?.from,
                                                  }));
                                                  if (!checkOut) {
                                                    setNum(3);
                                                  }
                                                } else if (num === 3) {
                                                  searchBarForm.setValue(
                                                    "date",
                                                    {
                                                      checkIn,
                                                      checkOut: range?.to
                                                        ? range.to
                                                        : range?.from,
                                                    }
                                                  );
                                                  setCheckInOut((prev) => ({
                                                    ...prev,
                                                    checkOut: range?.to,
                                                  }));
                                                  if (!checkIn) {
                                                    setNum(2);
                                                  }
                                                }
                                              }}
                                              numberOfMonths={2}
                                            />
                                          </div>
                                          <div className="flex flex-row items-center justify-between ml-14 mt-14 mb-10 h-[2.5rem] w-[30rem] p-1 gap-3">
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 0
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  0
                                                );
                                                setMarginOfDate(0);
                                              }}
                                            >
                                              정확한 날짜
                                            </button>
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 1
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  1
                                                );
                                                setMarginOfDate(1);
                                              }}
                                            >
                                              ± 1일
                                            </button>
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 2
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  2
                                                );
                                                setMarginOfDate(2);
                                              }}
                                            >
                                              ± 2일
                                            </button>
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 3
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  3
                                                );
                                                setMarginOfDate(3);
                                              }}
                                            >
                                              ± 3일
                                            </button>
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 7
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  7
                                                );
                                                setMarginOfDate(7);
                                              }}
                                            >
                                              ± 7일
                                            </button>
                                            <button
                                              type="button"
                                              className={clsx(
                                                "h-full py-1 px-4 justify-center text-center text-xs items-center bg-white border border-black/25 rounded-full",
                                                marginOfDate === 14
                                                  ? "border-2 !px-[0.95rem] !border-black !bg-black/5"
                                                  : "hover:border-black"
                                              )}
                                              onClick={() => {
                                                searchBarForm.setValue(
                                                  "date.marginOfDate",
                                                  14
                                                );
                                                setMarginOfDate(14);
                                              }}
                                            >
                                              ± 14일
                                            </button>
                                          </div>
                                        </>
                                      )}
                                      {dateType === "flexible" && (
                                        <div className="w-full my-5 px-10">
                                          <div className="w-full  mt-12">
                                            <h2 className="text-xl text-center">
                                              숙박 기간을 선택하세요.
                                            </h2>
                                            <div className="mt-4 w-full flex flex-row items-center justify-center">
                                              <button
                                                type="button"
                                                className={clsx(
                                                  "text-lg py-2 px-5 rounded-full text-center border border-black/25 hover:border-black mx-1",
                                                  flexibleDateType ===
                                                    "Weekend" &&
                                                    "border-2 !border-black !px-[1.2rem] !py-[0.4rem] !bg-black/5"
                                                )}
                                                onClick={() =>
                                                  setFlexibleDateType("Weekend")
                                                }
                                              >
                                                주말
                                              </button>
                                              <button
                                                type="button"
                                                className={clsx(
                                                  "text-lg py-2 px-5 rounded-full text-center border border-black/25 hover:border-black mx-1",
                                                  flexibleDateType === "Week" &&
                                                    "border-2 !border-black !px-[1.2rem] !py-[0.4rem] !bg-black/5"
                                                )}
                                                onClick={() =>
                                                  setFlexibleDateType("Week")
                                                }
                                              >
                                                일주일
                                              </button>
                                              <button
                                                type="button"
                                                className={clsx(
                                                  "text-lg py-2 px-5 rounded-full text-center border border-black/25 hover:border-black mx-1",
                                                  flexibleDateType ===
                                                    "Month" &&
                                                    "border-2 !border-black !px-[1.2rem] !py-[0.4rem] !bg-black/5"
                                                )}
                                                onClick={() =>
                                                  setFlexibleDateType("Month")
                                                }
                                              >
                                                한 달
                                              </button>
                                            </div>
                                            <h2 className="mt-11 text-xl text-center">
                                              여행 날짜를 선택하세요.
                                            </h2>
                                            <SearchBarCategory
                                              categoryRef={
                                                flexibleDateCategoryRef
                                              }
                                              active={num === 2}
                                              classNames={{
                                                parent:
                                                  "mt-8 w-full h-[9rem] items-center",
                                                leftButton:
                                                  "top-14 -left-5 size-8 p-[0.15rem] items-center justify-center border border-black/15 z-20 bg-white rounded-full shadow-sm cursor-pointer",
                                                rightButton:
                                                  "top-14 -right-5 size-8 p-[0.15rem] items-center justify-center border border-black/15 z-20 bg-white rounded-full shadow-sm cursor-pointer",
                                                content: "w-full h-full",
                                              }}
                                            >
                                              <div className="flex gap-2 w-[29rem] h-full items-center">
                                                {getMonth().map((item) => (
                                                  <button
                                                    type="button"
                                                    key={item.getMonth() + 1}
                                                    onClick={() => {
                                                      const selectedYearMonth =
                                                        {
                                                          month:
                                                            item.getMonth() + 1,
                                                          year: item.getFullYear(),
                                                        };
                                                      setFlexibleDateMonth(
                                                        (prev) => {
                                                          // Set이 참조형 데이터라서, 같은 객체를 유지한 채 내부 값을 바꾸면 리렌더링이 안 되는데,
                                                          // 새로운 Set을 만들어서 setState(new Set(...))로 할당하면 된다.

                                                          const newSet =
                                                            new Set(prev);
                                                          const newValue =
                                                            searchBarForm.getValues(
                                                              "flexibleMonth"
                                                            );
                                                          if (
                                                            newSet.has(
                                                              selectedYearMonth.month
                                                            )
                                                          ) {
                                                            newSet.delete(
                                                              selectedYearMonth.month
                                                            );
                                                            searchBarForm.setValue(
                                                              "flexibleMonth",
                                                              newValue.filter(
                                                                (item) =>
                                                                  item.month !==
                                                                  selectedYearMonth.month
                                                              )
                                                            );
                                                          } else {
                                                            newSet.add(
                                                              selectedYearMonth.month
                                                            );

                                                            searchBarForm.setValue(
                                                              "flexibleMonth",
                                                              [
                                                                ...newValue,
                                                                selectedYearMonth,
                                                              ]
                                                            );
                                                          }
                                                          return new Set(
                                                            newSet
                                                          );
                                                        }
                                                      );
                                                    }}
                                                    className={clsx(
                                                      // 클릭했을때 일어나는 효과는 active: 로 설정한다.
                                                      "h-full items-center px-10 py-8 border rounded-xl border-black/15 hover:border-black active:scale-90 transition-transform duration-75",
                                                      flexibleDateMonth?.has(
                                                        item.getMonth() + 1
                                                      )
                                                        ? "border-2 !border-black !px-[2.45rem] bg-black/5"
                                                        : ""
                                                    )}
                                                  >
                                                    <CalendarIcon className="size-11 pb-2" />
                                                    <p className="text-base">
                                                      {item.getMonth() + 1}월
                                                      <span className="text-sm">
                                                        {item.getFullYear()}
                                                      </span>
                                                    </p>
                                                  </button>
                                                ))}
                                              </div>
                                            </SearchBarCategory>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </SearchBarContent>
                              </SearchBarItem>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormLengthBar
                        className={clsx(
                          (hoverNum === 3 || hoverNum === 4) && "!bg-black/0"
                        )}
                      />
                      <FormField
                        control={searchBarForm.control}
                        name="people"
                        render={({ field }) => (
                          <FormItem
                            className={clsx(
                              "w-[32%] h-full",
                              ((num === 2 && dateType !== "SelectDate") ||
                                (num === 2 && searchType === "Experience")) &&
                                "!w-[42%] max-lg:!w-[44%]",
                              num === 3 && "!w-[42%] max-lg:!w-[44%]",
                              num === 4 && "!w-[16%]"
                            )}
                          >
                            <SearchBarItem
                              index={4}
                              smallBarClicked={smallNavBarClicked}
                              isInput={false}
                              prevPos={num}
                              safeAreaRef={typeButtonRef}
                            >
                              <SearchBarTrigger
                                onMouseDown={() => setNum(4)}
                                onMouseEnter={() => setHoverNum(4)}
                                onMouseLeave={() => setHoverNum(0)}
                                className={clsx(
                                  "flex flex-col py-2 gap-0 cursor-pointer w-full h-full rounded-full bg-white hover:bg-black/20 items-start justify-center px-6",
                                  ((num === 2 && dateType !== "SelectDate") ||
                                    (num === 2 &&
                                      searchType === "Experience")) &&
                                    "pl-[23.2%] max-lg:pl-[25.7%] guestTrigger_relative",
                                  num === 3 && "lg:pl-[30.25%] guestTrigger",
                                  num === 4 &&
                                    "shadow-xl hover:!bg-white absolute top-0 right-0 !w-[31.95%]",
                                  num !== 4 &&
                                    num !== 0 &&
                                    "!bg-slate-400 hover:!bg-slate-500"
                                )}
                              >
                                <div className="w-full flex flex-col">
                                  <FormLabel className="text-xs">
                                    여행자
                                  </FormLabel>
                                  <p className="w-[60%] text-sm truncate">
                                    {people.adult !== 0
                                      ? guestFormat()
                                      : "게스트 추가"}
                                  </p>
                                </div>
                              </SearchBarTrigger>
                              <SearchBarContent className="absolute top-20 right-0 w-[26rem] h-[26rem] p-8 rounded-[2rem] overflow-scroll bg-white shadow-lg  z-50">
                                <FormControl>
                                  <div className="w-full h-full bg-white">
                                    <div className="w-full h-[25%] flex flex-row bg-white">
                                      <div className="w-[60%] h-full bg-white p-[1.2rem]">
                                        <h3 className="text-lg">성인</h3>
                                        <p className="text-sm">13세 이상</p>
                                      </div>
                                      <div className="w-[40%] h-full flex gap-3 items-center justify-center bg-white">
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25 disabled:border-black/10 disabled:text-black/10"
                                          disabled={
                                            field.value.adult === 0 ||
                                            (field.value.adult === 1 &&
                                              (field.value.child !== 0 ||
                                                field.value.baby !== 0 ||
                                                field.value.pet !== 0))
                                          }
                                          onClick={() => {
                                            searchBarForm.setValue(
                                              "people.adult",
                                              searchBarForm.getValues(
                                                "people.adult"
                                              ) - 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              adult: prev.adult - 1,
                                            }));
                                          }}
                                        >
                                          -
                                        </button>
                                        <p className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white">
                                          {people.adult}
                                        </p>
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25"
                                          onClick={() => {
                                            searchBarForm.setValue(
                                              "people.adult",
                                              searchBarForm.getValues(
                                                "people.adult"
                                              ) + 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              adult: prev.adult + 1,
                                            }));
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="w-full h-[1px] bg-black/25" />
                                    <div className="w-full h-[25%] flex flex-row bg-white">
                                      <div className="w-[60%] h-full bg-white p-[1.2rem]">
                                        <h3 className="text-lg">어린이</h3>
                                        <p className="text-sm">2~12세</p>
                                      </div>
                                      <div className="w-[40%] h-full flex gap-3 items-center justify-center bg-white">
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25 disabled:border-black/10 disabled:text-black/10"
                                          disabled={field.value.child === 0}
                                          onClick={() => {
                                            searchBarForm.setValue(
                                              "people.child",
                                              searchBarForm.getValues(
                                                "people.child"
                                              ) - 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              child: prev.child - 1,
                                            }));
                                          }}
                                        >
                                          -
                                        </button>
                                        <p className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white">
                                          {people.child}
                                        </p>
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25"
                                          onClick={() => {
                                            if (
                                              searchBarForm.getValues(
                                                "people.adult"
                                              ) === 0
                                            ) {
                                              searchBarForm.setValue(
                                                "people.adult",
                                                1
                                              );
                                              setPeople((prev) => ({
                                                ...prev,
                                                adult: 1,
                                              }));
                                            }
                                            searchBarForm.setValue(
                                              "people.child",
                                              searchBarForm.getValues(
                                                "people.child"
                                              ) + 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              child: prev.child + 1,
                                            }));
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="w-full h-[1px] bg-black/25" />
                                    <div className="w-full h-[25%] flex flex-row bg-white">
                                      <div className="w-[60%] h-full bg-white p-[1.2rem]">
                                        <h3 className="text-lg">유아</h3>
                                        <p className="text-sm">2세 미만</p>
                                      </div>
                                      <div className="w-[40%] h-full flex gap-3 items-center justify-center bg-white">
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25 disabled:border-black/10 disabled:text-black/10"
                                          disabled={field.value.baby === 0}
                                          onClick={() => {
                                            searchBarForm.setValue(
                                              "people.baby",
                                              searchBarForm.getValues(
                                                "people.baby"
                                              ) - 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              baby: prev.baby - 1,
                                            }));
                                          }}
                                        >
                                          -
                                        </button>
                                        <p className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white">
                                          {people.baby}
                                        </p>
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25"
                                          onClick={() => {
                                            if (
                                              searchBarForm.getValues(
                                                "people.adult"
                                              ) === 0
                                            ) {
                                              searchBarForm.setValue(
                                                "people.adult",
                                                1
                                              );
                                              setPeople((prev) => ({
                                                ...prev,
                                                adult: 1,
                                              }));
                                            }
                                            searchBarForm.setValue(
                                              "people.baby",
                                              searchBarForm.getValues(
                                                "people.baby"
                                              ) + 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              baby: prev.baby + 1,
                                            }));
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="w-full h-[1px] bg-black/25" />
                                    <div className="w-full h-[25%] flex flex-row bg-white">
                                      <div className="w-[60%] h-full bg-white p-[1.2rem]">
                                        <h3 className="text-lg">반려동물</h3>
                                        <p className="text-sm">
                                          보조동물을 동반하시나요?
                                        </p>
                                      </div>
                                      <div className="w-[40%] h-full flex gap-3 items-center justify-center bg-white">
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25 disabled:border-black/10 disabled:text-black/10"
                                          disabled={field.value.pet === 0}
                                          onClick={() => {
                                            searchBarForm.setValue(
                                              "people.pet",
                                              searchBarForm.getValues(
                                                "people.pet"
                                              ) - 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              pet: prev.pet - 1,
                                            }));
                                          }}
                                        >
                                          -
                                        </button>
                                        <p className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white">
                                          {people.pet}
                                        </p>
                                        <button
                                          type="button"
                                          className="size-9 p-1 rounded-full text-center justify-center text-xl bg-white border border-black/25"
                                          onClick={() => {
                                            if (
                                              searchBarForm.getValues(
                                                "people.adult"
                                              ) === 0
                                            ) {
                                              searchBarForm.setValue(
                                                "people.adult",
                                                1
                                              );
                                              setPeople((prev) => ({
                                                ...prev,
                                                adult: 1,
                                              }));
                                            }
                                            searchBarForm.setValue(
                                              "people.pet",
                                              searchBarForm.getValues(
                                                "people.pet"
                                              ) + 1
                                            );
                                            setPeople((prev) => ({
                                              ...prev,
                                              pet: prev.pet + 1,
                                            }));
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                              </SearchBarContent>
                            </SearchBarItem>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className={clsx(
                        "absolute top-0 right-0 items-center justify-center m-[0.4rem] rounded-full size-[3.2rem] transition-all bg-black text-white",
                        num !== 0 ? "!w-[6rem] duration-0" : "duration-300"
                      )}
                    >
                      {num === 0 ? (
                        <Search className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex flex-row items-center justify-between">
                          <Search />
                          <p className="text-lg mr-1">검색</p>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center z-40">
          <p className="bg-white hover:bg-black/5 rounded-full h-[48px] w-[250px] text-center pt-3">
            당신의 공간을 에어비엔비하세요
          </p>
          <button className="bg-white hover:bg-black/5 shadow-none rounded-full w-[50px] h-[50px] p-4">
            <Image
              src="/globe.svg"
              alt="globe"
              width={100}
              height={100}
              className="bg-none"
            />
          </button>
          <Popover>
            <PopoverTrigger className="flex flex-row items-center justify-between bg-white border border-black/15 h-[50px] w-[5rem] rounded-full gap-2 px-2 hover:shadow-md">
              <Menu className="text-black size-6" />
              {account?.picture ? (
                <Image
                  src={account!.picture!}
                  width={50}
                  height={50}
                  alt={account!.name!}
                  className="size-8 rounded-full"
                />
              ) : (
                <UserCircle2 className="text-black size-[3rem]" />
              )}
            </PopoverTrigger>
            {!account ? (
              <PopoverContent
                className="w-[15rem] rounded-b-lg !px-0 py-2 border-none bg-white"
                align="end"
              >
                <div className="w-full h-full flex flex-col gap-1 bg-white">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full h-10 hover:bg-black/15 text-start px-4 text-base">
                        회원가입
                      </button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <button className="w-full h-10 hover:bg-black/15 text-start px-4 text-base">
                        로그인
                      </button>
                    </DialogTrigger>
                    <AuthForm />
                  </Dialog>
                  <div className="w-full h-[1px] my-1 bg-black/15" />
                  <Link href="#">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      당신의 공간을 에어비엔비하세요
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      체험 호스팅하기
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      도움말 센터
                    </p>
                  </Link>
                </div>
              </PopoverContent>
            ) : (
              <PopoverContent
                className="w-[15rem] rounded-b-lg !px-0 py-2 border-none bg-white"
                align="end"
              >
                <div className="w-full h-full flex flex-col gap-1">
                  <Link href="#">
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      메세지
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      알림
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      여행
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      위시리스트
                    </p>
                  </Link>
                  <div className="w-full h-[1px] my-1 bg-black/15" />
                  <Link href="/hosting">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      숙소 관리
                    </p>
                  </Link>
                  <Link href="/become-a-host">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      체험 호스팅하기
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      호스트 추천하기
                    </p>
                  </Link>
                  <Link href="#">
                    <p className="w-full h-8 hover:bg-black/15 px-4 text-sm py-[0.3rem]">
                      계정
                    </p>
                  </Link>
                  <div className="w-full h-[1px] my-1 bg-black/15" />
                  <Link href="#">
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      도움말 센터
                    </p>
                  </Link>
                  <button onClick={async () => logout()}>
                    <p className="flex w-full h-10 hover:bg-black/15 px-4 text-sm items-center text-start">
                      로그아웃
                    </p>
                  </button>
                </div>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
      <Bar />
      <nav></nav>
      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-dvh bg-black/25 z-[5]",
          searchBarVisible && hasScrolled ? "visible" : "hidden"
        )}
      />
    </header>
  );
};

export default Nav;
