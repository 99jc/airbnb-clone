"use server";
import BecomeAHostForm from "@/components/BecomeAHostForm";
import { getAccount } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await getAccount();
  const id = await params;
  if (!user.account) {
    redirect("/");
  }
  return (
    <div>
      <BecomeAHostForm hostingId={id.id} />
    </div>
  );
};

export default page;
