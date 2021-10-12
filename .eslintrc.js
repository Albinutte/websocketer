module.exports = {
  ignorePatterns: ['dist/**/*.*'],
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  overrides: [{
    files: ['public/**/*.*'],
    env: {
      browser: true
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }]
};
