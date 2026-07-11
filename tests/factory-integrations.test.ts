import { afterEach, describe, expect, it } from "vitest";

import {
  factoryConnectedIntegrationsById,
  factoryIntegrationCategories,
  factoryIntegrationsById,
  filterFactoryIntegrations,
  useFactoryStore,
} from "@/apps/factory/store";

function resetIntegrations() {
  useFactoryStore.setState({
    integrationsById: { ...factoryIntegrationsById },
    connectedIntegrationsById: { ...factoryConnectedIntegrationsById },
  });
}

describe("factory integrations", () => {
  afterEach(resetIntegrations);

  it("indexes all integrations and the initially connected integrations", () => {
    const state = useFactoryStore.getState();

    expect(Object.keys(state.integrationsById)).toHaveLength(206);
    expect(Object.keys(state.connectedIntegrationsById)).toEqual([
      "int-79",
      "int-60",
      "int-97",
      "int-new-24",
    ]);
    expect(state.connectedIntegrationsById["int-79"]).toBe(
      state.integrationsById["int-79"],
    );
  });

  it("assigns every unique category to one of five non-empty groups", () => {
    const categoryIds = factoryIntegrationCategories.map(
      (category) => category.id,
    );
    const groups = new Set(
      factoryIntegrationCategories.map((category) => category.group),
    );

    expect(factoryIntegrationCategories).toHaveLength(28);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(
      factoryIntegrationCategories.every(
        (category) => category.group.trim().length > 0,
      ),
    ).toBe(true);
    expect(groups).toEqual(
      new Set([
        "AI & Data",
        "Business & Commerce",
        "Developer Platform",
        "Infrastructure",
        "Security & Communication",
      ]),
    );

    for (const group of groups) {
      expect(
        factoryIntegrationCategories.some(
          (category) => category.group === group,
        ),
      ).toBe(true);
    }
  });

  it("adds a valid integration once and keeps the connected record synchronized", () => {
    const store = useFactoryStore.getState();

    store.addConnectedIntegration("int-1");
    store.addConnectedIntegration("int-1");

    const state = useFactoryStore.getState();
    expect(Object.keys(state.connectedIntegrationsById)).toHaveLength(5);
    expect(state.connectedIntegrationsById["int-1"]).toBe(
      state.integrationsById["int-1"],
    );
  });

  it("removes a connected integration safely", () => {
    const store = useFactoryStore.getState();

    store.removeConnectedIntegration("int-79");
    store.removeConnectedIntegration("int-79");

    const state = useFactoryStore.getState();
    expect(Object.keys(state.connectedIntegrationsById)).toHaveLength(3);
    expect(state.connectedIntegrationsById["int-79"]).toBeUndefined();
    expect(state.integrationsById["int-79"]).toBeDefined();
  });

  it("ignores unknown integration ids", () => {
    const before = useFactoryStore.getState().connectedIntegrationsById;

    useFactoryStore.getState().addConnectedIntegration("unknown");
    useFactoryStore.getState().removeConnectedIntegration("unknown");

    expect(useFactoryStore.getState().connectedIntegrationsById).toBe(before);
  });

  it("filters by case-insensitive name and category while preserving order", () => {
    const integrations = Object.values(factoryIntegrationsById);

    expect(
      filterFactoryIntegrations(integrations, "adp", "cat-int-21").map(
        (integration) => integration.id,
      ),
    ).toEqual(["int-3", "int-4"]);
    expect(filterFactoryIntegrations(integrations, "XERO", "all")).toEqual([
      factoryIntegrationsById["int-97"],
    ]);
    expect(
      filterFactoryIntegrations(integrations, "xero", "cat-int-3"),
    ).toEqual([]);
  });
});
