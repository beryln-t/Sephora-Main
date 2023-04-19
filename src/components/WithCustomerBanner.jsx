import React from "react";
import Banners from "./Banners";
import WithNavBar from "./WithNavBar";

export default function ({ children }) {
  return (
    <React.Fragment>
      <WithNavBar preContent={<Banners></Banners>}>{children}</WithNavBar>
    </React.Fragment>
  );
}
