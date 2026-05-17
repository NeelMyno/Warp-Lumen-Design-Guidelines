import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popover } from "./popover";

describe("Popover", () => {
  it("renders without throwing", () => {
    render(<Popover>Popover</Popover>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
