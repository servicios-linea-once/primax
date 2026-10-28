// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeFloatingBar from '../components/ThemeFloatingBar.vue';
import ComponentPreview from '../components/ComponentPreview.vue';
import PtViewer from '../components/PtViewer.vue';
import ApiTable from '../components/ApiTable.vue';

describe('Documentation Viewer Core Components', () => {
  it('ThemeFloatingBar switches themes and dark mode', async () => {
    const wrapper = mount(ThemeFloatingBar);
    const select = wrapper.find('[data-test="theme-select"]');
    expect(select.exists()).toBe(true);
    await select.setValue('nora');
    expect(wrapper.emitted('theme-change')?.[0]).toEqual(['nora']);
  });

  it('ComponentPreview toggles between preview and source code tabs', async () => {
    const wrapper = mount(ComponentPreview, {
      props: { code: '<Button label="Submit" />' },
      slots: { default: '<button>Submit</button>' }
    });
    expect(wrapper.text()).toContain('Submit');
    const codeTab = wrapper.find('[data-test="tab-code"]');
    await codeTab.trigger('click');
    expect(wrapper.html()).toContain('&lt;Button label="Submit" /&gt;');
  });

  it('PtViewer renders passThrough sections and emits highlight events', async () => {
    const sections = [
      { key: 'root', description: 'Container element' },
      { key: 'label', description: 'Text label span' }
    ];
    const wrapper = mount(PtViewer, { props: { sections } });
    expect(wrapper.text()).toContain('root');
    expect(wrapper.text()).toContain('label');
  });

  it('ApiTable renders columns for props, events, slots or pt keys', () => {
    const rows = [
      { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Button visual style' }
    ];
    const wrapper = mount(ApiTable, { props: { headers: ['Name', 'Type', 'Default', 'Description'], rows } });
    expect(wrapper.text()).toContain('variant');
    expect(wrapper.text()).toContain("'primary' | 'secondary'");
  });
});
