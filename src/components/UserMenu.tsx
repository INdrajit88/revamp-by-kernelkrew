"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { JwtPayload, decode } from "jsonwebtoken";

import { cookies } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useCallback, useEffect } from "react";
import { User as UserI, useGlobalContext } from "./ContextProvider";
import FlexContainer from "./FlexContainer";

type Props = {
  user: JwtPayload & UserI;
};

const UserMenu: FC<Props> = ({ user }) => {
  const { setUser, setIsLoaded } = useGlobalContext();
  console.log(user, "useryxdyz");
  const router = useRouter();
  useEffect(() => {
    if (user._id) {
      setUser(user);
      setIsLoaded(true);
    }
  }, [user]);
  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          name={user.first_name}
          description={user.username}
          className="cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem href="/dashboard">Dashboard</DropdownItem>
        <DropdownItem
          onPress={async () => {
            setUser(null);
            const res = await fetch("/api/auth/logout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
            router.refresh();
          }}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserMenu;
