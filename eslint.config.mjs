import { createRequire } from 'node:module';
import eslintConfigPrettier from 'eslint-config-prettier';

const require = createRequire(import.meta.url);

/** Next.js 공식 flat 설정 (`eslint-config-next/core-web-vitals`) */
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

/** @type {import('eslint').Linter.Config[]} */
export default [...nextCoreWebVitals, eslintConfigPrettier];
