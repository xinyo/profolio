import { mockItems } from "@/views/explore/mock";

export const exploreFontVariants = [
  "plex",
  "nunito",
  "serif",
  "mono",
  "system",
] as const;

export type ExploreFontVariant = (typeof exploreFontVariants)[number];

export type ExploreItem = {
  slug: string;
  title: string;
  subtitle: string;
  href?: string;
  coverImage: string;
  backgroundColor: string;
  foregroundColor: string;
  spineLabelColor: string;
  fontVariant: ExploreFontVariant;
  caseThicknessPx: number;
  restingTiltDeg: number;
};

export type ExploreActivationSource = "mouse" | "keyboard" | "touch";

export type ExploreInteractionState = {
  activeSlug: string | null;
  touchArmedSlug: string | null;
  activationSource: ExploreActivationSource | null;
};

export type TouchActivationResult = {
  state: ExploreInteractionState;
  shouldNavigate: boolean;
};

export const initialExploreInteractionState: ExploreInteractionState = {
  activeSlug: null,
  touchArmedSlug: null,
  activationSource: null,
};

export const exploreItems = mockItems as ExploreItem[];

export function activateExploreItem(
  slug: string,
  activationSource: Exclude<ExploreActivationSource, "touch">,
): ExploreInteractionState {
  return {
    activeSlug: slug,
    touchArmedSlug: null,
    activationSource,
  };
}

export function hoverExploreItem(slug: string): ExploreInteractionState {
  return activateExploreItem(slug, "mouse");
}

export function focusExploreItem(slug: string): ExploreInteractionState {
  return activateExploreItem(slug, "keyboard");
}

export function leaveExploreItem(
  state: ExploreInteractionState,
  slug: string,
): ExploreInteractionState {
  if (state.activeSlug !== slug || state.activationSource !== "mouse") {
    return state;
  }

  return resetExploreInteraction();
}

export function blurExploreItem(
  state: ExploreInteractionState,
  slug: string,
): ExploreInteractionState {
  if (state.activeSlug !== slug || state.activationSource !== "keyboard") {
    return state;
  }

  return resetExploreInteraction();
}

export function activateExploreItemByTouch(
  state: ExploreInteractionState,
  slug: string,
  hasDestination: boolean,
): TouchActivationResult {
  const isArmed = state.activeSlug === slug && state.touchArmedSlug === slug;

  return {
    state: {
      activeSlug: slug,
      touchArmedSlug: slug,
      activationSource: "touch",
    },
    shouldNavigate: isArmed && hasDestination,
  };
}

export function resetExploreInteraction(): ExploreInteractionState {
  return initialExploreInteractionState;
}
