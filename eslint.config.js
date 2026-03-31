import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      curly: ['error', 'all'],
      'max-len': ['error', { code: 120, ignoreComments: true }],
      'no-tabs': 'error',
      'no-underscore-dangle': ['error', { allow: ['_KEY'] }],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
    },
  },
)
