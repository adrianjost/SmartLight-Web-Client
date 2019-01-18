module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended'
  ],
  rules: {
    'no-console': (process.env.NODE_ENV === "production") ? 'error' : 'off',
    'no-debugger': (process.env.NODE_ENV === "production") ? 'error' : 'off',
    "vue/html-indent": ["error", "tab"],
    "vue/script-indent": ["error", "tab"],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
