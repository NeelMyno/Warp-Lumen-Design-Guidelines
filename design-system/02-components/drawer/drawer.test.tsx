import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Drawer } from "./drawer";

describe("Drawer", () => {
  it("renders without throwing", () => {
    render(<Drawer>Drawer</Drawer>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
