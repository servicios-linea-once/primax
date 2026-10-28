import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';
import {
  ThemeFloatingBar,
  ComponentPreview,
  PtViewer,
  ApiTable
} from '../../components';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ThemeFloatingBar', ThemeFloatingBar);
    app.component('ComponentPreview', ComponentPreview);
    app.component('PtViewer', PtViewer);
    app.component('ApiTable', ApiTable);
  }
};

export default theme;
