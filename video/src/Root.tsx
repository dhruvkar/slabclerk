import React from "react";
import { Composition } from "remotion";
import { ClerkDemo } from "./ClerkDemo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="ClerkDemo"
      component={ClerkDemo}
      durationInFrames={480}
      fps={30}
      width={1200}
      height={760}
    />
  );
};
