import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup } from "./radio";

describe("Radio", () => {
  it("renders without throwing", () => {
    render(<RadioGroup>Radio</RadioGroup>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
