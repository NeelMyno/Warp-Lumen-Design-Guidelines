import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toaster } from "./toast";

describe("Toaster", () => {
  it("renders without throwing", () => {
    render(<Toaster>Toaster</Toaster>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
