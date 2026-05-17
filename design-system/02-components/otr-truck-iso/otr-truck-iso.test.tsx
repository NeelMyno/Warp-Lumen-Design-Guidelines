import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OTRTruckIso } from "./otr-truck-iso";

describe("OTRTruckIso", () => {
  it("renders without throwing", () => {
    render(<OTRTruckIso>OTRTruckIso</OTRTruckIso>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
