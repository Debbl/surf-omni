import { twMerge } from "~/lib/tw";
import { type IIcon, Icon } from "~/icons";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button(
  props: {
    children: ReactNode;
    leftIcon?: IIcon;
  } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { leftIcon, children } = props;

  const _props = Object.fromEntries(
    Object.entries(props).filter(
      ([key]) => !["leftIcon", "children", "className"].includes(key),
    ),
  );

  return (
    <button
      className={twMerge(
        "w-full",
        "flex items-center gap-x-1",
        "px-2 py-1",
        "text-sm",
        "rounded-md",
        "hover:bg-gray-100",
        props.className ?? "",
      )}
      {..._props}
    >
      {leftIcon && <Icon icon={leftIcon} />}
      {children}
    </button>
  );
}
