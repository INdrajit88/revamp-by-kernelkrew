import { Input } from "@nextui-org/react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
// import { useGlobalContext } from "./ContextProvider";
import { JwtPayload, decode, verify } from "jsonwebtoken";
import { User as UserI } from "./ContextProvider";
import FlexContainer from "./FlexContainer";
import UserMenu from "./UserMenu";

type Props = {};

const Navbar = (props: Props) => {
  // const { user } = useGlobalContext();
  // const router = useRouter();
  const token = cookies().get("token")?.value;
  const user = token
    ? (verify(token as string, process.env.JWT_SECRET as string) as JwtPayload &
        UserI)
    : null;

  return (
    <FlexContainer
      variant="row-between"
      wrap="nowrap"
      className="mx-auto h-[80px] w-full max-w-screen-2xl items-center bg-transparent px-10"
    >
      <Link
        href={"/"}
        className="font-poppins text-xl font-[800] text-[#11a39f]"
      >
        revamp
      </Link>
      {/* <Input
        type="text"
        placeholder="Search for a topic"
        classNames={{
          base: "w-[300px]",
          input: "text-center",
          inputWrapper: "border shadow-none",
        }}
        // value={}
        // onValueChange={}
      /> */}
      <FlexContainer>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link
            href={"/signin"}
            className="rounded-xl px-3 py-1.5 text-sm font-medium duration-100 hover:bg-zinc-100"
          >
            {`Login`}
          </Link>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Navbar;
