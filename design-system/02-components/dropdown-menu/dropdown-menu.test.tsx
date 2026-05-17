import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DropdownMenu } from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders without throwing", () => {
    render(<DropdownMenu>DropdownMenu</DropdownMenu>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
