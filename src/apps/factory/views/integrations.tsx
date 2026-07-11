import { EllipsisVertical, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  factoryIntegrationCategories,
  filterFactoryIntegrations,
  useFactoryStore,
  type FactoryIntegration,
} from "@/apps/factory/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IntegrationsViewMode = "connected" | "marketplace";

export function IntegrationsView() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<IntegrationsViewMode>("connected");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const integrationsById = useFactoryStore((state) => state.integrationsById);
  const connectedIntegrationsById = useFactoryStore(
    (state) => state.connectedIntegrationsById,
  );
  const addConnectedIntegration = useFactoryStore(
    (state) => state.addConnectedIntegration,
  );
  const removeConnectedIntegration = useFactoryStore(
    (state) => state.removeConnectedIntegration,
  );

  const visibleIntegrations = useMemo(() => {
    const source =
      mode === "marketplace"
        ? Object.values(integrationsById)
        : Object.values(connectedIntegrationsById);

    return filterFactoryIntegrations(source, query, categoryId);
  }, [categoryId, connectedIntegrationsById, integrationsById, mode, query]);

  const hasFilters = query.trim().length > 0 || categoryId !== "all";
  const emptyMessage = hasFilters
    ? t("factory.views.integrations.noMatches")
    : t("factory.views.integrations.noConnected");

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.integrations.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.integrations.subtitle")}
          </p>
        </div>
        <Button
          variant={mode === "marketplace" ? "outline" : "default"}
          onClick={() =>
            setMode(mode === "marketplace" ? "connected" : "marketplace")
          }
        >
          {mode !== "marketplace" && <Store className="size-4" />}
          {mode === "marketplace"
            ? t("factory.views.integrations.connectedIntegrations")
            : t("factory.views.integrations.marketplace")}
        </Button>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("factory.views.integrations.searchPlaceholder")}
              aria-label={t("factory.views.integrations.searchPlaceholder")}
            />
          </div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger
              className="w-[220px]"
              aria-label={t("factory.views.integrations.filterByCategory")}
            >
              <SelectValue
                placeholder={t("factory.views.integrations.filterByCategory")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("factory.views.integrations.allCategories")}
              </SelectItem>
              {factoryIntegrationCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {visibleIntegrations.length > 0 ? (
        <div className="factory-integration-list">
          {visibleIntegrations.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              categoryName={
                factoryIntegrationCategories.find(
                  (category) => category.id === integration.category,
                )?.name ?? integration.category
              }
              isMarketplace={mode === "marketplace"}
              isConnected={Boolean(connectedIntegrationsById[integration.id])}
              connectedLabel={t("factory.views.integrations.connected")}
              connectLabel={t("factory.views.integrations.connect")}
              moreOptionsLabel={t("factory.views.integrations.moreOptions", {
                name: integration.name,
              })}
              disconnectLabel={t("factory.views.integrations.disconnect")}
              onConnect={() => addConnectedIntegration(integration.id)}
              onDisconnect={() => removeConnectedIntegration(integration.id)}
            />
          ))}
        </div>
      ) : (
        <div className="factory-integration-empty" role="status">
          <p>{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}

function IntegrationItem({
  integration,
  categoryName,
  isMarketplace,
  isConnected,
  connectedLabel,
  connectLabel,
  moreOptionsLabel,
  disconnectLabel,
  onConnect,
  onDisconnect,
}: {
  integration: FactoryIntegration;
  categoryName: string;
  isMarketplace: boolean;
  isConnected: boolean;
  connectedLabel: string;
  connectLabel: string;
  moreOptionsLabel: string;
  disconnectLabel: string;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <Item className="factory-integration-item" variant="outline" size="default">
      <ItemMedia variant="image" className="factory-integration-media">
        <img src={integration.image} alt="" />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle>{integration.name}</ItemTitle>
        <ItemDescription title={integration.description}>
          {integration.description}
        </ItemDescription>
        <span className="factory-integration-category">{categoryName}</span>
      </ItemContent>
      <ItemActions>
        {isMarketplace ? (
          isConnected ? (
            <Badge className="factory-integration-connected" variant="outline">
              {connectedLabel}
            </Badge>
          ) : (
            <Button variant="outline" size="sm" onClick={onConnect}>
              {connectLabel}
            </Button>
          )
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={moreOptionsLabel}
              >
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={onDisconnect}>
                {disconnectLabel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </ItemActions>
    </Item>
  );
}
