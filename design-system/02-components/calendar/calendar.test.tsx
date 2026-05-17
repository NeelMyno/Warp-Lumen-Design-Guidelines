import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("renders without throwing", () => {
    render(<Calendar>Calendar</Calendar>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
