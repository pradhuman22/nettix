import { PropsWithChildren } from "react";

const MainWrapper = ({ children }: PropsWithChildren) => {
  return <div className={"mx-auto max-w-4xl px-4 md:px-0"}>{children}</div>;
};

export default MainWrapper;
