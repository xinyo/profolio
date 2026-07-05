import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Boxes,
  Building2,
  CalendarClock,
  CalendarDays,
  Clock,
  CreditCard,
  DollarSign,
  HelpCircleIcon,
  KeyboardIcon,
  Languages,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Monitor,
  Moon,
  Palette,
  ReceiptText,
  Search,
  Settings,
  Sparkles,
  Sun,
  Truck,
  User,
  Users,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/apps/factory/components/search-dialog";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FactoryAvatar } from "@/apps/factory/components/Avatar";
import mockData from "@/apps/factory/mock.json";
import {
  factoryLanguageOptions,
  factoryTimezoneOptions,
  useFactoryStore,
  type FactoryLanguage,
  type FactoryTimezone,
} from "@/apps/factory/store";

interface NavSection {
  labelKey: string;
  items: {
    labelKey: string;
    to: string;
    icon: React.ComponentType<{ "aria-hidden"?: boolean | "true" }>;
    end?: boolean;
  }[];
}

const navigationSections: NavSection[] = [
  {
    labelKey: "factory.navigation.sections.general",
    items: [
      {
        labelKey: "factory.navigation.items.overview",
        to: "/apps/factory",
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.products",
    items: [
      {
        labelKey: "factory.navigation.items.productCategories",
        to: "/apps/factory/product-categories",
        icon: LayoutGrid,
      },
      {
        labelKey: "factory.navigation.items.materials",
        to: "/apps/factory/materials",
        icon: Boxes,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.sales",
    items: [
      {
        labelKey: "factory.navigation.items.salesOrders",
        to: "/apps/factory/sales-orders",
        icon: ReceiptText,
      },
      {
        labelKey: "factory.navigation.items.customers",
        to: "/apps/factory/customers",
        icon: Users,
      },
      {
        labelKey: "factory.navigation.items.priceLevelManager",
        to: "/apps/factory/price-level-manager",
        icon: DollarSign,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.purchasing",
    items: [
      {
        labelKey: "factory.navigation.items.purchaseOrders",
        to: "/apps/factory/purchase-orders",
        icon: ReceiptText,
      },
      {
        labelKey: "factory.navigation.items.suppliers",
        to: "/apps/factory/suppliers",
        icon: Building2,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.productivity",
    items: [
      {
        labelKey: "factory.navigation.items.workflow",
        to: "/apps/factory/workflow",
        icon: Workflow,
      },
      {
        labelKey: "factory.navigation.items.planners",
        to: "/apps/factory/planners",
        icon: CalendarDays,
      },
      {
        labelKey: "factory.navigation.items.deliveryScheduling",
        to: "/apps/factory/delivery-scheduling",
        icon: Truck,
      },
      {
        labelKey: "factory.navigation.items.timesheets",
        to: "/apps/factory/timesheets",
        icon: Clock,
      },
    ],
  },
];

export function FactoryNavigations() {
  const { t } = useTranslation();
  const { user, trial } = mockData;
  const { setIsDark } = useTheme(false);

  const isNavPanelOpen = useFactoryStore((state) => state.isNavPanelOpen);
  const language = useFactoryStore((state) => state.language);
  const timezone = useFactoryStore((state) => state.timezone);
  const setLanguage = useFactoryStore((state) => state.setLanguage);
  const setTimezone = useFactoryStore((state) => state.setTimezone);

  return (
    <>
      <nav
        className="factory-sidepanel-nav"
        aria-label={t("factory.navigation.label")}
      >
        <SearchDialog>
          <Button
            variant="ghost"
            className="factory-search-button"
            aria-label={t("factory.navigation.search")}
          >
            <span className="factory-search-button-content">
              <span className="factory-search-button-label">
                <Search aria-hidden="true" />
                {isNavPanelOpen && (
                  <span>{t("factory.navigation.search")}</span>
                )}
              </span>
              {isNavPanelOpen && (
                <span
                  className="factory-search-button-shortcut"
                  aria-hidden="true"
                >
                  ⌘K
                </span>
              )}
            </span>
          </Button>
        </SearchDialog>
        {navigationSections.map((section) => (
          <div className="factory-nav-section" key={section.labelKey}>
            <CollapsibleContent asChild>
              <p className="factory-nav-section-label">{t(section.labelKey)}</p>
            </CollapsibleContent>
            {section.items.map(({ labelKey, to, icon: Icon, end }) => {
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
          </div>
        ))}
      </nav>

      <footer className="factory-sidepanel-footer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="factory-account-trigger"
              type="button"
              aria-label={t("factory.account.openMenu", { name: user.name })}
            >
              <FactoryAvatar avatar={user.avatar} name={user.name} />
              <CollapsibleContent asChild>
                <span className="factory-account-copy">
                  <span className="factory-account-name">{user.name}</span>
                  <span className="factory-account-type">
                    {user.accountType}
                  </span>
                </span>
              </CollapsibleContent>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="factory-account-menu"
            side="top"
            align="start"
            sideOffset={8}
          >
            <DropdownMenuItem>
              <User />
              {t("factory.account.menu.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              {t("factory.account.menu.billing")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              {t("factory.account.menu.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette />
                {t("factory.account.menu.appearance")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setIsDark(false)}>
                  <Sun />
                  {t("factory.account.menu.light")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDark(true)}>
                  <Moon />
                  {t("factory.account.menu.dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDark(false)}>
                  <Monitor />
                  {t("factory.account.menu.system")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages />
                {t("factory.account.menu.language")}
                <DropdownMenuShortcut>{language}</DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={(value) =>
                    setLanguage(value as FactoryLanguage)
                  }
                >
                  {factoryLanguageOptions.map((languageOption) => (
                    <DropdownMenuRadioItem
                      value={languageOption}
                      key={languageOption}
                    >
                      {languageOption}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CalendarClock />
                {t("factory.account.menu.timezone")}
                <DropdownMenuShortcut>{timezone}</DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={timezone}
                  onValueChange={(value) =>
                    setTimezone(value as FactoryTimezone)
                  }
                >
                  {factoryTimezoneOptions.map((timezoneOption) => (
                    <DropdownMenuRadioItem
                      value={timezoneOption}
                      key={timezoneOption}
                    >
                      {timezoneOption === "Local"
                        ? t("factory.account.menu.local")
                        : timezoneOption}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HelpCircleIcon />
              {t("factory.account.menu.helpSupport")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyboardIcon />
              {t("factory.account.menu.keyboardShortcuts")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="factory-account-upgrade">
              <Sparkles />
              {t("factory.account.menu.upgrade")}
              <Badge variant="secondary" className="ml-2">
                {trial.badgeLabel}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut />
              {t("factory.account.menu.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </>
  );
}
