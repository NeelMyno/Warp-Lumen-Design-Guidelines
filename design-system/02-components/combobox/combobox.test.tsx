import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Combobox } from "./combobox";

describe("Combobox", () => {
  it("renders without throwing", () => {
    render(<Combobox>Combobox</Combobox>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
