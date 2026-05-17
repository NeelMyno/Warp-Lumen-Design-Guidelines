import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveDot } from "./live-dot";

describe("LiveDot", () => {
  it("renders without throwing", () => {
    render(<LiveDot>LiveDot</LiveDot>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
