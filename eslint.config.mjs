import js from '@eslint/js';
import typescript from 'typescript-eslint';
import next from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'dist/',
      '.vercel/',
      'coverage/'
    ]
  },
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      '@next/next': next
    },
    rules: {
      // Next.js rules
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      
      // TypeScript rules (reasonable defaults)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'warn',
      
      // General JavaScript/TypeScript rules
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info']
        }
      ],
      'no-var': 'warn',
      'prefer-const': 'warn',
      'prefer-arrow-callback': 'warn',
      'eqeqeq': ['warn', 'always'],
      
      // Disable strict rules that would cause too many warnings
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off'
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/no-unescaped-entities': 'off'
    }
  }
];

