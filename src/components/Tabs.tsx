import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import React, { FC } from "react";

export const BORDER_EFFECT =
  "bg-zinc-100 hover:border-zinc-300 border duration-100";

export const BORDER_EFFECT_ACTIVE =
  "bg-zinc-900 border-zinc-900 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-700 duration-100";

export const BORDER_EFFECT_ERROR =
  "bg-red-100 border-red-300 text-red-500 hover:bg-red-200 hover:border-red-400 duration-100";

interface TabProps {
  title: string;
  isActiveTab: boolean;
  isError?: boolean;
  onClick: () => void;
}

const Tab: FC<TabProps> = ({
  title,
  isActiveTab,
  isError = false,
  onClick,
  ...props
}) => {
  return (
    <div
      className={cn(
        "cursor-pointer text-nowrap rounded-xl px-3 py-2 text-sm font-medium active:scale-95",
        BORDER_EFFECT,
        isActiveTab && BORDER_EFFECT_ACTIVE,
        isError && BORDER_EFFECT_ERROR,
      )}
      onClick={onClick}
      {...props}
    >
      {title}
    </div>
  );
};

export default Tab;
