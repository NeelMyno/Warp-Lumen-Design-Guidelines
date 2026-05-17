import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PalletTile } from "./pallet-tile";

describe("PalletTile", () => {
  it("renders without throwing", () => {
    render(<PalletTile>PalletTile</PalletTile>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
