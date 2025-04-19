"use server";
import BecomeAHostForm from "@/components/BecomeAHostForm";
import { getAccount } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getAccount();
  if (!user.account) {
    redirect("/");
  }
  return (
    <div>
      <BecomeAHostForm />
    </div>
  );
};

export default page;
