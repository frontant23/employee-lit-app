import {NavigationMenu} from '../dev/components/navigation-menu.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('navigation-menu', () => {
  test('is defined', () => {
    const el = document.createElement('navigation-menu');
    assert.instanceOf(el, NavigationMenu);
  });

  test('renders navigation links', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    assert.shadowDom.equal(
      el,
      `
      <nav>
        <div>
          <a href="/">
            Employee List
          </a>
          <a href="/add">
            Add Employee
          </a>
        </div>
        <div class="locale-selector">
          <label for="locale-select">
            Change Locale:
          </label>
          <select id="locale-select">
            <option
              selected=""
              value="en"
            >
              English
            </option>
            <option value="tr">
              Turkish
            </option>
          </select>
        </div>
      </nav>
      `
    );
  });

  test('locale select changes', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const select = el.shadowRoot.querySelector('#locale-select');
    select.value = 'tr';
    select.dispatchEvent(new Event('change'));
    await el.updateComplete;

    assert.equal(select.value, 'tr', 'Locale should be set to Turkish');
  });

  test('styling applied', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const navEl = el.shadowRoot.querySelector('nav');
    await navEl.updateComplete;
    assert.equal(getComputedStyle(navEl).display, 'flex');
    assert.equal(getComputedStyle(navEl).alignItems, 'center');
  });
});
