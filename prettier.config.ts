import { type Config } from 'prettier';

const config: Config = {
  trailingComma: 'none',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  bracketSpacing: true,
  objectWrap: 'collapse',
  arrowParens: 'always',
  endOfLine: 'lf',
  singleAttributePerLine: true
};

export default config;
