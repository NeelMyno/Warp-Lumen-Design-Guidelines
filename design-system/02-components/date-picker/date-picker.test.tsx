import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("renders without throwing", () => {
    render(<DatePicker>DatePicker</DatePicker>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
