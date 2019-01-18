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
    /*
    "vue/html-indent": ["error", "tab", {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": []
    }],
    */
    "vue/script-indent": ["error", "tab"],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
