import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrossDockGrid } from "./cross-dock-grid";

describe("CrossDockGrid", () => {
  it("renders without throwing", () => {
    render(<CrossDockGrid>CrossDockGrid</CrossDockGrid>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
