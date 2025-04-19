import Nav from "@/components/Nav";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Nav autoSpreadMode={false} />
      {children}
    </div>
  );
};

export default Layout;
