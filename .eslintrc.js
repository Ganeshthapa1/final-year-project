module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: 12,
    sourceType: "module",
    requireConfigFile: false,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  plugins: [
    "vue"
  ],
  rules: {
    "no-unused-vars": "warn",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "max-len": "off"
      }
    }
  ]
};
