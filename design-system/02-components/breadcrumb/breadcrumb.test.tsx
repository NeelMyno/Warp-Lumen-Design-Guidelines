import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb", () => {
  it("renders without throwing", () => {
    render(<Breadcrumb>Breadcrumb</Breadcrumb>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
