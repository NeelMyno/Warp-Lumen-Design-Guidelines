import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "./top-bar";

describe("TopBar", () => {
  it("renders without throwing", () => {
    render(<TopBar>TopBar</TopBar>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
