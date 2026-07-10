import { afterEach, describe, expect, it } from "vitest";

import {
  createFactoryApiKey,
  joinFactoryUserName,
  maskFactoryApiKey,
  splitFactoryUserName,
} from "@/apps/factory/profile";
import {
  factoryApiKeys,
  factoryUser,
  useFactoryStore,
} from "@/apps/factory/store";

function resetProfile() {
  useFactoryStore.setState({
    user: { ...factoryUser },
    language: factoryUser.language,
    timezone: factoryUser.timezone,
  });
}

describe("factory profile", () => {
  afterEach(() => {
    resetProfile();
  });

  it("splits and joins user names for account editing", () => {
    expect(splitFactoryUserName("Avery Morgan")).toEqual({
      firstName: "Avery",
      lastName: "Morgan",
    });
    expect(
      joinFactoryUserName({ firstName: "Avery", lastName: "Morgan" }),
    ).toBe("Avery Morgan");
  });

  it("updates store-backed profile fields without changing unrelated state", () => {
    const originalEmployees = useFactoryStore.getState().employees;

    useFactoryStore.getState().updateUserProfile({
      name: "Avery Stone",
      email: "avery.stone@factory.example",
      location: "loc-2",
      language: "Deutsch",
      timezone: "UTC",
      appearance: "Dark",
      keyboardShortcuts: false,
      avatar: "/src/assets/avatar/agent_avatar_12.svg",
    });

    const state = useFactoryStore.getState();

    expect(state.user).toMatchObject({
      name: "Avery Stone",
      email: "avery.stone@factory.example",
      location: "loc-2",
      language: "Deutsch",
      timezone: "UTC",
      appearance: "Dark",
      keyboardShortcuts: false,
      avatar: "/src/assets/avatar/agent_avatar_12.svg",
    });
    expect(state.language).toBe("Deutsch");
    expect(state.timezone).toBe("UTC");
    expect(state.employees).toBe(originalEmployees);
  });

  it("initializes mock API keys", () => {
    expect(factoryApiKeys).toHaveLength(3);
    expect(factoryApiKeys[0]).toMatchObject({
      id: "key-production",
      name: "Production automation",
    });
  });

  it("generates API keys visible once with masked persisted values", () => {
    const apiKey = createFactoryApiKey(" Dispatch connector ");

    expect(apiKey).toMatchObject({
      name: "Dispatch connector",
      maskedKey: maskFactoryApiKey(apiKey?.value ?? ""),
    });
    expect(apiKey?.value).toContain("fk_live_mock");
    expect(apiKey?.maskedKey).not.toBe(apiKey?.value);
  });

  it("does not generate unnamed API keys", () => {
    expect(createFactoryApiKey("   ")).toBeNull();
  });
});
