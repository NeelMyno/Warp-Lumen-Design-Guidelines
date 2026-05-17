import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sheet } from "./sheet";

describe("Sheet", () => {
  it("renders without throwing", () => {
    render(<Sheet>Sheet</Sheet>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
