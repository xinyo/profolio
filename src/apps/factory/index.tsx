import "./styles.css";
import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation } from "react-router";
import {
  Menu,
  BotMessageSquare,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AiChat } from "@/apps/factory/components/ai-chat";
import { FactoryNavigations } from "@/apps/factory/components/navigations";
import { OverviewView } from "@/apps/factory/views/overview";
import { ProductionView } from "@/apps/factory/views/production";

const factoryViewTitles = [
  {
    path: "/apps/factory/production",
    titleKey: "factory.views.production.title",
  },
  {
    path: "/apps/factory",
    titleKey: "factory.views.overview.title",
  },
];

const CHAT_PANEL_MIN_WIDTH = 300;
const CHAT_PANEL_MAX_VIEWPORT_GUTTER = 96;

export function FactoryApp() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(CHAT_PANEL_MIN_WIDTH);
  const [isResizingChatPanel, setIsResizingChatPanel] = useState(false);
  const activeView = factoryViewTitles.find(({ path }) => pathname === path);
  const viewTitle = t(activeView?.titleKey ?? "factory.views.overview.title");
  const pageStyle = {
    "--factory-chat-panel-width": `${chatPanelWidth}px`,
  } as CSSProperties;

  useEffect(() => {
    if (!isResizingChatPanel) {
      return;
    }

    function handlePointerMove(event: globalThis.PointerEvent) {
      const maxWidth = Math.max(
        CHAT_PANEL_MIN_WIDTH,
        window.innerWidth - CHAT_PANEL_MAX_VIEWPORT_GUTTER,
      );
      const nextWidth = window.innerWidth - event.clientX;

      setChatPanelWidth(
        Math.min(Math.max(nextWidth, CHAT_PANEL_MIN_WIDTH), maxWidth),
      );
    }

    function handlePointerUp() {
      setIsResizingChatPanel(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    document.body.classList.add("factory-chat-resizing");

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.classList.remove("factory-chat-resizing");
    };
  }, [isResizingChatPanel]);

  function handleChatResizeStart(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsResizingChatPanel(true);
  }

  return (
    <main
      className="factory-app-page"
      data-chat-state={isChatPanelOpen ? "open" : "closed"}
      style={pageStyle}
    >
      <Collapsible
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        className="factory-sidepanel"
        data-state={isPanelOpen ? "open" : "closed"}
      >
        <div className="factory-sidepanel-top">
          <CollapsibleContent className="factory-sidepanel-title">
            <span>{t("factory.title")}</span>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="factory-panel-toggle"
              aria-label={
                isPanelOpen
                  ? t("factory.navigation.collapse")
                  : t("factory.navigation.expand")
              }
            >
              {isPanelOpen ? <PanelLeftClose /> : <Menu />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <FactoryNavigations />
      </Collapsible>

      <Collapsible
        open={isChatPanelOpen}
        onOpenChange={setIsChatPanelOpen}
        className="factory-chat-collapsible"
      >
        <section className="factory-app-workspace">
          <header className="app-view-header">
            <span>{viewTitle}</span>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="factory-chat-toggle"
                aria-label={
                  isChatPanelOpen
                    ? t("factory.chat.collapse")
                    : t("factory.chat.expand")
                }
              >
                {isChatPanelOpen ? <PanelRightClose /> : <BotMessageSquare />}
              </Button>
            </CollapsibleTrigger>
          </header>
          <div className="app-view-content">
            <Routes>
              <Route index element={<OverviewView />} />
              <Route path="production" element={<ProductionView />} />
              <Route
                path="*"
                element={<Navigate to="/apps/factory" replace />}
              />
            </Routes>
          </div>
        </section>

        <CollapsibleContent className="factory-chat-panel">
          <div
            className="factory-chat-resize-handle"
            role="separator"
            aria-label={t("factory.chat.resize")}
            aria-orientation="vertical"
            aria-valuemin={CHAT_PANEL_MIN_WIDTH}
            aria-valuenow={chatPanelWidth}
            tabIndex={0}
            onPointerDown={handleChatResizeStart}
          />
          <div className="factory-chat-panel-header">
            <BotMessageSquare aria-hidden="true" />
            <span>{t("factory.chat.title")}</span>
          </div>
          <AiChat isOpen={isChatPanelOpen} />
        </CollapsibleContent>
      </Collapsible>
    </main>
  );
}
