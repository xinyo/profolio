import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Timer,
} from "lucide-react";

import { CollapsibleContent } from "@/components/ui/collapsible";

const navigationItems = [
  {
    labelKey: "factory.navigation.items.overview",
    to: "/apps/factory",
    icon: LayoutDashboard,
    end: true,
  },
  {
    labelKey: "factory.navigation.items.production",
    to: "/apps/factory/production",
    icon: Factory,
  },
  {
    labelKey: "factory.navigation.items.schedule",
    to: "/apps/factory/schedule",
    icon: CalendarClock,
  },
  {
    labelKey: "factory.navigation.items.tasks",
    to: "/apps/factory/tasks",
    icon: ClipboardList,
  },
  {
    labelKey: "factory.navigation.items.timers",
    to: "/apps/factory/timers",
    icon: Timer,
  },
];

export function FactoryNavigations() {
  const { t } = useTranslation();

  return (
    <nav className="factory-sidepanel-nav" aria-label={t("factory.navigation.label")}>
      {navigationItems.map(({ labelKey, to, icon: Icon, end }) => {
        const label = t(labelKey);

        return (
          <NavLink
            className="factory-nav-item"
            to={to}
            end={end}
            title={label}
            key={labelKey}
          >
            <Icon aria-hidden="true" />
            <CollapsibleContent asChild>
              <span>{label}</span>
            </CollapsibleContent>
          </NavLink>
        );
      })}
    </nav>
  );
}
