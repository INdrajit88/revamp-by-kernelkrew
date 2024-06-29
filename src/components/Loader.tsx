import { Loader2 } from "lucide-react";
import React from "react";
import FlexContainer from "./FlexContainer";

type Props = {};

const Loader = (props: Props) => {
  return (
    <FlexContainer variant="row-start" className="px-10 py-5">
      <Loader2 clssName="w-5 h-5 animate-spin" />
    </FlexContainer>
  );
};

export default Loader;
