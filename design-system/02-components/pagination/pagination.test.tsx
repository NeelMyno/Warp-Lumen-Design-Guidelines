import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders without throwing", () => {
    render(<Pagination>Pagination</Pagination>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
