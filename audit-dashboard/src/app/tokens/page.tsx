import { TokensClient } from "./client";

export const metadata = {
  title: "Token Browser · Lumen",
  description:
    "Live introspection of the Lumen v0.13 DTCG 2025.10 token graph — filter by layer + category, search by name, click any token for resolved value, references, and copy-to-clipboard.",
};

export default function TokensPage() {
  return <TokensClient />;
}
