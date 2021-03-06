module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'no-unused-vars': [
      2,
      {
        vars: 'local',
        args: 'none'
      }
    ],
    'vue/no-unused-vars': 'warning',
    'no-useless-return': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
