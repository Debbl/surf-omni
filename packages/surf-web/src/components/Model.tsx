import { createPortal } from "react-dom";
import { Close, Icon } from "~/icons";
import { cn } from "~/lib/utils";
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

  return createPortal(
    <div className="fixed inset-0 bg-black/40">
      <div
        role="dialog"
        className={cn(
          "mt-[15vh]",
          "w-80 py-4 px-5",
          "absolute right-1/2 translate-x-1/2",
          "rounded-md bg-white",
          "shadow-md",
          props.className,
        )}
      >
        <div className="flex items-center justify-between pb-2 text-base font-normal">
          <div className="font-bold">{title}</div>
          <button onClick={onCancel} className="rounded-md hover:bg-gray-200">
            <Icon icon={Close} className="text-2xl" />
          </button>
        </div>

        <div>{props.children}</div>

        <div className="mt-2 flex justify-end gap-x-2">
          <Button
            className="w-20 justify-center"
            variant="outline"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            className="w-20 justify-center"
            variant="default"
            onClick={onOk}
          >
            确定
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
