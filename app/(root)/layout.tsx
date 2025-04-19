"use server";
import Nav from "@/components/Nav";
import { getAccount } from "@/lib/auth";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getAccount();
  console.log(user);
  return (
    <div>
      <Nav autoSpreadMode={true} account={user.account} />
      {children}
    </div>
  );
};

export default Layout;
