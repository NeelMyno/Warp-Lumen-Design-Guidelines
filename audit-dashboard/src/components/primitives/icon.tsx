/**
 * Lumen icon set — re-exports from lucide-react.
 *
 * v0.5: every Lumen icon is now sourced from lucide-react. The Lumen API stays
 * stable: same export names, same `size` prop. Internally each icon is just
 * the lucide component with `aria-hidden` defaulted on (icons are decorative
 * by default; meaning lives on the surrounding button's aria-label).
 *
 * If you need a NEW icon: just `import { ... } from "lucide-react"` directly
 * in your component instead of adding another re-export here.
 */

import {
  ArrowRight as LArrowRight,
  Check as LCheck,
  Plus as LPlus,
  Search as LSearch,
  Truck as LTruck,
  MapPin as LMapPin,
  Box as LBox,
  Settings as LSettings,
  Bell as LBell,
  Home as LHome,
  Filter as LFilter,
  ChevronDown as LChevronDown,
  ShoppingCart as LCart,
  User as LUser,
  X as LX,
  Inbox as LInbox,
  Code as LCode,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

type IconProps = Omit<LucideProps, "size"> & { size?: number };

const wrap = (Comp: LucideIcon) => {
  const W = ({ size = 16, ...p }: IconProps) => (
    <Comp size={size} aria-hidden focusable={false} strokeWidth={1.5} {...p} />
  );
  W.displayName = Comp.displayName ?? Comp.name;
  return W;
};

export const ArrowRight   = wrap(LArrowRight);
export const Check        = wrap(LCheck);
export const Plus         = wrap(LPlus);
export const Search       = wrap(LSearch);
export const Truck        = wrap(LTruck);
export const MapPin       = wrap(LMapPin);
export const Box          = wrap(LBox);
export const Settings     = wrap(LSettings);
export const Bell         = wrap(LBell);
export const Home         = wrap(LHome);
export const Filter       = wrap(LFilter);
export const ChevronDown  = wrap(LChevronDown);
export const Cart         = wrap(LCart);
export const User         = wrap(LUser);
export const X            = wrap(LX);
export const Inbox        = wrap(LInbox);
export const Code         = wrap(LCode);
