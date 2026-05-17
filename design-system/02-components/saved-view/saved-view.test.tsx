import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SavedView } from "./saved-view";

describe("SavedView", () => {
  it("renders without throwing", () => {
    render(<SavedView>SavedView</SavedView>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
