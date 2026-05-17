import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./progress";

describe("Progress", () => {
  it("renders without throwing", () => {
    render(<ProgressBar>Progress</ProgressBar>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
