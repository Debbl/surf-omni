import { Icon, Loading as IconLoading } from "~/icons";

export function Loading() {
  return (
    <div className="flex size-full items-center justify-center text-3xl">
      <Icon icon={IconLoading} />
    </div>
  );
}
