import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import security from "eslint-plugin-security";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/_app.js", "**/license.js", "node_modules/*"],
}, ...fixupConfigRules(compat.extends("plugin:react/recommended")), {
    plugins: {
        react: fixupPluginRules(react),
        security: fixupPluginRules(security),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        "react/no-unknown-property": "off",
        "react/prop-types": "off",

        "max-len": ["error", {
            code: 130,
        }],

        indent: ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "import/prefer-default-export": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/label-has-for": "off",
    },
}];