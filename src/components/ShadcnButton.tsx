import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "flat"
    | "default";
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
};

const getClass = (variant: Props["variant"]) => {
  switch (variant) {
    case "primary":
      return "bg-[#11a39f] hover:bg-[#11a39f]/70 active:bg-[#11a39f]";
    case "secondary":
      return "bg-black hover:bg-zinc-700 active:bg-zinc-900";
    case "success":
      return "bg-green-600 hover:bg-green-500 active:bg-green-800";
    case "warning":
      return "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-800";
    case "error":
      return "bg-red-500 hover:bg-red-600 active:bg-red-800";
    case "flat":
      return "bg-transparent text-black hover:bg-zinc-100 active:bg-zinc-200";
    case "default":
      return "bg-zinc-100 text-black hover:bg-zinc-200 active:bg-zinc-300";
    default:
      return "bg-zinc-100 text-black hover:bg-zinc-200 active:bg-zinc-300";
  }
};

const ShadcnButton = (props: Props) => {
  const variant = props.variant || "primary";
  const variantClass = getClass(variant);
  return (
    <Button
      type={props.type}
      className={cn(
        "rounded-lg px-7 py-5 font-work-sans shadow-none",
        variantClass,
        props.className,
      )}
      onClick={props.onClick}
      disabled={props.isDisabled}
    >
      {props.isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        props.children
      )}
    </Button>
  );
};

export default ShadcnButton;
