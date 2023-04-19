module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "@ehicks05/eslint-config/packages/react",
    "@ehicks05/eslint-config/packages/base",
    "@ehicks05/eslint-config/packages/typescript",
  ],
  prettier: {
    endOfLine: 'auto',
  }
};