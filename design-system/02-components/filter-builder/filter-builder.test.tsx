import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterBuilder } from "./filter-builder";

describe("FilterBuilder", () => {
  it("renders without throwing", () => {
    render(<FilterBuilder>FilterBuilder</FilterBuilder>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
