import { nextJsConfig } from "@workspace/eslint-config/next-js"

export default [
  ...nextJsConfig,
  {
    ignores: [".next/**", "out/**", "build/**"],
  },
]
