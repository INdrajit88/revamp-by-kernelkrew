import FlexContainer from "@/components/FlexContainer";
import ShadcnButton from "@/components/ShadcnButton";
import Wrapper from "@/components/Wrapper";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Wrapper className="relative">
      <Image
        src={"/bg.jpeg"}
        width={1920}
        height={1080}
        alt="bg"
        className="relative h-[calc(100vh_-_80px)] w-full object-cover object-[50%_90%]"
      />
      <div className="absolute inset-x-0 bottom-0 px-5 py-10">
        <FlexContainer variant="row-between" className="items-center">
          <FlexContainer variant="column-start">
            <h3 className="font-poppins text-4xl font-bold text-zinc-800">
              Welcome to <span className="text-[#11a39f]">Revamp</span>
            </h3>
            <h2 className="font-poppins text-7xl font-bold text-zinc-800">
              Fix your home with ease
            </h2>
          </FlexContainer>
          <Link href={"/signin"}>
            <ShadcnButton variant="primary" className="rounded-3xl px-10 py-6">
              Get Started <ChevronRight size={24} />
            </ShadcnButton>
          </Link>
        </FlexContainer>
      </div>
    </Wrapper>
  );
}
