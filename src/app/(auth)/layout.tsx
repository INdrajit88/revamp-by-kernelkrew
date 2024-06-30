"use client";

import FlexContainer from "@/components/FlexContainer";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const pathname = usePathname().replace("/", "");
  return (
    <div className="grid h-[calc(100vh_-_80px)] grid-cols-1 lg:grid-cols-2">
      <FlexContainer
        variant="column-between"
        gap="lg"
        className="hidden h-full w-full bg-black px-5 py-10 lg:flex"
      >
        <h3 className="text-xl font-medium text-indigo-200">revamp</h3>
        <p className="text-5xl text-white">
          Welcome to revamp,
          <br /> {pathname} to continue
        </p>
      </FlexContainer>
      {props.children}
    </div>
  );
};

export default Layout;
