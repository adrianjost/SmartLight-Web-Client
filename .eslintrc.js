module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-indent': [
      'error',
      'tab'
    ],
    'vue/script-indent': [
      'error',
      'tab'
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase'
    ],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
