import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommandPalette } from "./command-palette";

describe("CommandPalette", () => {
  it("renders without throwing", () => {
    render(<CommandPalette>CommandPalette</CommandPalette>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
