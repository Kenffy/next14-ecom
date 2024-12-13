const azureEnvVars = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "CLOUDIFY_API_URL",
  "CLOUDIFY_API_KEY",
] as const;

type RequiredServerEnvKeys = (typeof azureEnvVars)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
  }
}

export {};
