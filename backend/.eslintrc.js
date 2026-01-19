module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/']
};