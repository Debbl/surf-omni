import { twMerge } from "tailwind-merge";
import { Close, Icon } from "~/icons";
import { Button } from "./Button";
import type { ReactNode } from "react";

export function Model(props: {
  title?: string;
  open: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  const { title = "标题", open, onCancel, onOk } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/20">
      <div
        role="dialog"
        className={twMerge(
          "mt-[15vh]",
          "w-80 py-4 px-5",
          "absolute right-1/2 translate-x-1/2",
          "rounded-md bg-white",
          props.className,
        )}
      >
        <div className="flex items-center justify-between pb-2 text-base font-normal">
          <div>{title}</div>
          <button onClick={onCancel} className="rounded-md hover:bg-gray-200">
            <Icon icon={Close} className="text-2xl" />
          </button>
        </div>

        <div>{props.children}</div>

        <div className="mt-2 flex justify-end gap-x-2">
          <Button
            className="w-20 justify-center rounded-md border"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            className="w-20 justify-center rounded-md border bg-blue-600 text-white hover:bg-blue-700"
            onClick={onOk}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}
