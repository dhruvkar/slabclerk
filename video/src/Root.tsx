import React from "react";
import { Composition } from "remotion";
import { ClerkDemo } from "./ClerkDemo";
import { Demo, timing, DemoConfig } from "./DemoTemplate";
import {
  containerWatchdog,
  collectionsClerk,
  slabOfferDesk,
  poEntry,
  slabDesk,
  holdSentry,
  newArrivals,
} from "./demos";

const demoComp = (id: string, config: DemoConfig) => (
  <Composition
    id={id}
    component={Demo}
    durationInFrames={timing(config).duration}
    fps={30}
    width={1200}
    height={760}
    defaultProps={{ config }}
  />
);

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ClerkDemo"
        component={ClerkDemo}
        durationInFrames={480}
        fps={30}
        width={1200}
        height={760}
      />
      {demoComp("POEntry", poEntry)}
      {demoComp("ContainerWatchdog", containerWatchdog)}
      {demoComp("CollectionsClerk", collectionsClerk)}
      {demoComp("SlabOfferDesk", slabOfferDesk)}
      {demoComp("SlabDesk", slabDesk)}
      {demoComp("HoldSentry", holdSentry)}
      {demoComp("NewArrivals", newArrivals)}
    </>
  );
};
