module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'prettier-standard',
    'plugin:prettier-vue/recommended',
    'prettier/babel',
    'prettier/vue'
  ],
  plugins: ['prettier', 'vue'],
  rules: {
    'import/extensions': [
      'error',
      {
        vue: 'never',
        js: 'never'
      }
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.return value
        ]
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
