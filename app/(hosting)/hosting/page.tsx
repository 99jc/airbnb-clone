"use server";
import Nav2 from "@/components/Nav2";
import { getAccount } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getAccount();
  if (!user.account) {
    redirect("/");
  }
  console.log(user.account);
  return (
    <div>
      <Nav2 account={user.account} />
      <div className="px-20 w-full h-dvh">
        <div className="flex flex-row justify-between items-center w-full h-40">
          <h1 className="text-3xl">{user.account.name} 님, 안녕하세요!</h1>
          <Link href="#">
            <p className="px-3.5 py-1 border border-black rounded-sm cursor-pointer hover:bg-black/5">
              숙소 등록 완료하기
            </p>
          </Link>
        </div>
        <div className="flex flex-row justify-between items-center w-full h-20">
          <h2 className="text-2xl">예약</h2>
          <Link href="#">
            <p className="px-2 py-1 rounded-sm cursor-pointer hover:bg-black/5">
              모든 예약(0개)
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
