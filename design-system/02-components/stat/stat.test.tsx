import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stat } from "./stat";

describe("Stat", () => {
  it("renders without throwing", () => {
    render(<Stat>Stat</Stat>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
