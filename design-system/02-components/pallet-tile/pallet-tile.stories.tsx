// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from these stories via
// features.componentsManifest in .storybook/main.ts.
import type { Meta, StoryObj } from "@storybook/nextjs";
import { PalletTile } from "./pallet-tile";

const meta: Meta<typeof PalletTile> = {
  title: "T4/PalletTile",
  component: PalletTile,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
};

export default meta;

type Story = StoryObj<typeof PalletTile>;

export const Default: Story = {
  args: {
    "id": "PAL-1247",
    "weightLbs": 840,
    "dims": {
      "l": 48,
      "w": 40,
      "h": 60
    },
    "freightClass": 100,
    "lane": {
      "origin": "LAX",
      "destination": "SFO"
    }
  },
  render: (args) => <PalletTile {...args}>PalletTile</PalletTile>,
};

export const Hazmat: Story = {
  args: {
    "id": "PAL-9921",
    "weightLbs": 620,
    "dims": {
      "l": 48,
      "w": 40,
      "h": 48
    },
    "freightClass": 175,
    "hazmat": true,
    "lane": {
      "origin": "ORD",
      "destination": "ATL"
    }
  },
  render: (args) => <PalletTile {...args}>PalletTile</PalletTile>,
};

