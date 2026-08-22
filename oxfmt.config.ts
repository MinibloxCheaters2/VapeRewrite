import {defineConfig} from "oxfmt";

export default defineConfig({
  sortImports: {
    newlinesBetween: true,
    order: "asc",
    groups: [
      "type-import",
      ["value-builtin", "value-external"],
      "value-internal",
      ["value-parent", "value-sibling", "value-index"],
      "unknown"
    ]
  }
});
