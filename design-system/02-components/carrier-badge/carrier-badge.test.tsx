import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarrierBadge } from "./carrier-badge";

describe("CarrierBadge", () => {
  it("renders without throwing", () => {
    render(<CarrierBadge>CarrierBadge</CarrierBadge>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
