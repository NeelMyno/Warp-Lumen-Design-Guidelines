import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterChip } from "./filter-chip";

describe("FilterChip", () => {
  it("renders without throwing", () => {
    render(<FilterChip>FilterChip</FilterChip>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
