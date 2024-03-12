import { Outlet } from "react-router-dom";
import stylex from "@stylexjs/stylex";
import { globalStyles } from "@/entrypoints/styles";

export default function Profile() {
  return (
    <div {...stylex.props(globalStyles["size-full"])}>
      <Outlet />
    </div>
  );
}
