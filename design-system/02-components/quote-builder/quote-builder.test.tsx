import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuoteBuilder } from "./quote-builder";

describe("QuoteBuilder", () => {
  it("renders without throwing", () => {
    render(<QuoteBuilder>QuoteBuilder</QuoteBuilder>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

});
