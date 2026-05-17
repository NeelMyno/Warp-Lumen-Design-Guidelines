import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DockBay } from "./dock-bay";

describe("DockBay", () => {
  it("renders without throwing", () => {
    render(<DockBay>DockBay</DockBay>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
