import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  activateExploreItemByTouch,
  blurExploreItem,
  exploreItems,
  focusExploreItem,
  hoverExploreItem,
  initialExploreInteractionState,
  leaveExploreItem,
  resetExploreInteraction,
  type ExploreInteractionState,
  type ExploreItem,
} from "@/views/explore-model";

type CustomProperties = CSSProperties & Record<`--${string}`, string>;

type DiscCuboidProps = {
  item: ExploreItem;
  isActive: boolean;
  previewLabel: string;
};

function DiscCuboid({ item, isActive, previewLabel }: DiscCuboidProps) {
  return (
    <>
      <span className="disc-pose" aria-hidden="true">
        <span className="disc-cuboid">
          <span className="disc-face disc-face-front">
            <img src={item.coverImage} alt="" />
            <span className="disc-front-shine" />
            <span className="disc-front-copy">
              <span className="disc-front-title">{item.title}</span>
              <span className="disc-front-subtitle">{item.subtitle}</span>
              <span className="disc-front-status">
                {item.href ? <ArrowUpRight /> : null}
                {previewLabel}
              </span>
            </span>
          </span>
          <span className="disc-face disc-face-back" />
          <span className="disc-face disc-face-spine">
            <span className="disc-spine-label">{item.title}</span>
          </span>
          <span className="disc-face disc-face-edge" />
          <span className="disc-face disc-face-top" />
          <span className="disc-face disc-face-bottom" />
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {isActive ? item.subtitle : ""}
      </span>
    </>
  );
}

type LastInputSource = "mouse" | "keyboard" | "touch" | "pen" | null;

export function Explore() {
  const { t } = useTranslation();
  const [interaction, setInteraction] = useState<ExploreInteractionState>(
    initialExploreInteractionState,
  );
  const interactionRef = useRef(interaction);
  const suppressNextClickRef = useRef(false);
  const lastInputSourceRef = useRef<LastInputSource>(null);
  const activeItem =
    exploreItems.find(({ slug }) => slug === interaction.activeSlug) ?? null;

  function updateInteraction(nextState: ExploreInteractionState) {
    interactionRef.current = nextState;
    setInteraction(nextState);
  }

  function resetInteraction() {
    suppressNextClickRef.current = false;
    updateInteraction(resetExploreInteraction());
  }

  function handlePointerEnter(
    event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
    slug: string,
  ) {
    if (event.pointerType !== "mouse") return;
    lastInputSourceRef.current = "mouse";
    updateInteraction(hoverExploreItem(slug));
  }

  function handlePointerLeave(
    event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
    slug: string,
  ) {
    if (event.pointerType !== "mouse") return;
    updateInteraction(leaveExploreItem(interactionRef.current, slug));
  }

  function handleFocus(event: FocusEvent<HTMLLIElement>, slug: string) {
    if (event.currentTarget === event.target) return;
    if (
      interactionRef.current.activeSlug === slug &&
      (lastInputSourceRef.current === "mouse" ||
        lastInputSourceRef.current === "touch" ||
        lastInputSourceRef.current === "pen")
    )
      return;

    lastInputSourceRef.current = "keyboard";
    updateInteraction(focusExploreItem(slug));
  }

  function handleBlur(event: FocusEvent<HTMLLIElement>, slug: string) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    updateInteraction(blurExploreItem(interactionRef.current, slug));
  }

  function handleItemPointerDown(
    event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: ExploreItem,
  ) {
    lastInputSourceRef.current = event.pointerType as LastInputSource;

    if (event.pointerType !== "touch" && event.pointerType !== "pen") {
      suppressNextClickRef.current = false;
      return;
    }

    const result = activateExploreItemByTouch(
      interactionRef.current,
      item.slug,
      Boolean(item.href),
    );
    suppressNextClickRef.current = !result.shouldNavigate;
    updateInteraction(result.state);
  }

  function handleItemClick(
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    if (!suppressNextClickRef.current) return;
    event.preventDefault();
    suppressNextClickRef.current = false;
  }

  function handlePagePointerDown(event: PointerEvent<HTMLElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest(".disc-item")) return;
    resetInteraction();
  }

  const pageStyle = {
    "--explore-background": activeItem?.backgroundColor ?? "var(--bg)",
    "--explore-foreground": activeItem?.foregroundColor ?? "var(--text-h)",
  } as CustomProperties;

  return (
    <main
      className="explore-page"
      style={pageStyle}
      transition-style="in:wipe:right"
      onPointerDownCapture={handlePagePointerDown}
      onKeyDown={(event) => {
        lastInputSourceRef.current = "keyboard";
        if (event.key === "Escape") resetInteraction();
      }}
    >
      <div className="explore-header">
        <div className="view-copy">
          <p className="view-kicker">{t("explore.kicker")}</p>
          <h1 className="text-4xl">{t("explore.title")}</h1>
          <p>{t("explore.description")}</p>
        </div>

        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft />
            {t("explore.home")}
          </Link>
        </Button>
      </div>

      <section
        className="disc-collection"
        aria-label={t("explore.collectionLabel")}
      >
        <div className="disc-rack-scroll">
          <ul className="disc-rack">
            {exploreItems.map((item) => {
              const isActive = interaction.activeSlug === item.slug;
              const itemStyle = {
                "--disc-background": item.backgroundColor,
                "--disc-foreground": item.spineLabelColor,
                "--disc-thickness": `${item.caseThicknessPx}px`,
                "--disc-hit-width": `${Math.max(
                  44,
                  item.caseThicknessPx,
                )}px`,
                "--disc-resting-tilt": `${item.restingTiltDeg}deg`,
              } as CustomProperties;
              const commonProps = {
                className: "disc-case",
                onPointerEnter: (
                  event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
                ) => handlePointerEnter(event, item.slug),
                onPointerLeave: (
                  event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
                ) => handlePointerLeave(event, item.slug),
                onPointerDown: (
                  event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
                ) => handleItemPointerDown(event, item),
                onClick: handleItemClick,
              };

              return (
                <li
                  className="disc-item"
                  data-active={isActive || undefined}
                  data-font={item.fontVariant}
                  data-slug={item.slug}
                  key={item.slug}
                  style={itemStyle}
                  onFocusCapture={(event) => handleFocus(event, item.slug)}
                  onBlurCapture={(event) => handleBlur(event, item.slug)}
                >
                  {item.href ? (
                    <a
                      {...commonProps}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("explore.openProject", {
                        title: item.title,
                      })}
                    >
                      <DiscCuboid
                        item={item}
                        isActive={isActive}
                        previewLabel={t("explore.open")}
                      />
                    </a>
                  ) : (
                    <button
                      {...commonProps}
                      type="button"
                      aria-expanded={isActive}
                      aria-label={t("explore.revealProject", {
                        title: item.title,
                      })}
                    >
                      <DiscCuboid
                        item={item}
                        isActive={isActive}
                        previewLabel={t("explore.previewOnly")}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
