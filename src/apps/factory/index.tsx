import "./styles.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FactoryNavigations } from "@/apps/factory/components/navigations";

export function FactoryApp() {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <main className="factory-app-page">
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
              {isPanelOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <FactoryNavigations />
      </Collapsible>

      <section className="factory-app-workspace">
        <header className="app-view-header">{t("factory.title")}</header>
      </section>
    </main>
  );
}
