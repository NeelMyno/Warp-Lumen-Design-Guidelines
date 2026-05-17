// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { PalletTile } from "./pallet-tile";

const meta = defineMeta({
  title: "T4/PalletTile",
  component: PalletTile,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
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
});

export const Hazmat = meta.story({
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
});

