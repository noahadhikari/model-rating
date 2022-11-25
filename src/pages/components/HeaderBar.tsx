import { IsBestOrientation } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const HeaderBar = () => {
  function goHome() {
    window.location.href = "/";
  }

  return (
    <div className="headerBar">
      <header onClick={goHome}>URAP 3D Model Rating</header>
    </div>
  );
};

export default HeaderBar;
