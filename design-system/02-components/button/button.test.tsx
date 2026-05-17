import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders without throwing", () => {
    render(<Button>Save changes</Button>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });

  it("renders an aria-busy=true while loading and suppresses click", () => {
    const onClick = vi.fn();
    render(<Button intent="primary" loading onClick={onClick}>Saving</Button>);
    const btn = screen.getByRole("button", { name: /saving/i });
    expect(btn.getAttribute("aria-busy")).toBe("true");
    btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });
  it("renders aria-pressed when pressed prop is true", () => {
    render(<Button intent="secondary" pressed>Toggle</Button>);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });
});
