module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-undef": "error",
    "comma-dangle": "off",
    semi: "off",
    quotes: "off",
    "quote-props": "off",
    "object-shorthand": "off",
    "spaced-comment": "off",
    "space-before-function-paren": "off",
    "padded-blocks": "off",
    "object-curly-spacing": "off",
    "space-before-blocks": "off",
    camelcase: "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off",
    indent: "off",
    "eol-last": "off",
    "comma-spacing": "off",
    "key-spacing": "off",
    "arrow-spacing": "off",
    "no-throw-literal": "off",
  },
};
