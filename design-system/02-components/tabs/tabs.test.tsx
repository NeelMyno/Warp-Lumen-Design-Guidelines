import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./tabs";

describe("Tabs", () => {
  it("renders without throwing", () => {
    render(<Tabs>Tabs</Tabs>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
