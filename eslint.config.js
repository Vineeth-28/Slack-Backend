import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from 'globals'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node }
  }
])
