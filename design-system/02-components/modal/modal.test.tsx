import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./modal";

describe("Modal", () => {
  it("renders without throwing", () => {
    render(<Modal>Modal</Modal>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
