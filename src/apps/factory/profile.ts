export type FactoryProfileNameParts = {
  firstName: string;
  lastName: string;
};

export type FactoryGeneratedApiKey = {
  id: string;
  name: string;
  value: string;
  maskedKey: string;
};

let generatedApiKeyCounter = 0;

export function splitFactoryUserName(name: string): FactoryProfileNameParts {
  const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
}

export function joinFactoryUserName({
  firstName,
  lastName,
}: FactoryProfileNameParts) {
  return [firstName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export function maskFactoryApiKey(value: string) {
  const prefix = value.slice(0, 8);
  const suffix = value.slice(-4);

  return `${prefix}************************${suffix}`;
}

export function createFactoryApiKey(name: string): FactoryGeneratedApiKey | null {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return null;
  }

  generatedApiKeyCounter += 1;

  const sequence = String(generatedApiKeyCounter).padStart(4, "0");
  const value = `fk_live_mock_${sequence}_9f3b7c2a`;

  return {
    id: `generated-api-key-${sequence}`,
    name: normalizedName,
    value,
    maskedKey: maskFactoryApiKey(value),
  };
}
