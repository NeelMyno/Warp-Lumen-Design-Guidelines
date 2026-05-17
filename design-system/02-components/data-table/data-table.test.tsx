import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

describe("DataTable", () => {
  it("renders without throwing", () => {
    render(<DataTable>DataTable</DataTable>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
