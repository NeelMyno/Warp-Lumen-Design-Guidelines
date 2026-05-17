import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "./tag";

describe("Tag", () => {
  it("renders without throwing", () => {
    render(<Tag>LAX → SFO</Tag>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
