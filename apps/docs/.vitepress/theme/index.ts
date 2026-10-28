import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Viewer components will be registered here
  }
};

export default theme;
