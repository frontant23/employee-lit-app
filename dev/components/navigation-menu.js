import {LitElement, html, css} from 'lit';
import localeData from './navigation-menu-locales.js';

export class NavigationMenu extends LitElement {
  constructor() {
    super();
    this.currentLanguage = document.documentElement.lang || 'en';
  }

  render() {
    const strings = localeData[this.currentLanguage];

    return html`
      <nav>
        <div>
          <a href="/"> ${strings.menu.employeeList} </a>
          <a href="/add"> ${strings.menu.addEmployee} </a>
        </div>
        <div class="locale-selector">
          <label for="locale-select">${strings.menu.changeLocale}:</label>
          <select id="locale-select" @change="${this.changeLocale}">
            <option value="en" ?selected="${this.currentLanguage === 'en'}">
              ${strings.menu.localeOptions.en}
            </option>
            <option value="tr" ?selected="${this.currentLanguage === 'tr'}">
              ${strings.menu.localeOptions.tr}
            </option>
          </select>
        </div>
      </nav>
    `;
  }

  changeLocale(event) {
    this.currentLanguage = event.target.value;
    document.documentElement.lang = this.currentLanguage;
    document.dispatchEvent(
      new CustomEvent('locale-changed', {detail: this.currentLanguage})
    );

    this.requestUpdate();
  }

  static styles = css`
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #007bff;
      padding: 10px 20px;
      color: white;
      border-radius: 5px;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 10px;
      transition: background-color 0.3s;
    }

    a:hover {
      background-color: #0056b3;
      border-radius: 4px;
    }

    .locale-selector {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    select {
      padding: 5px;
      border-radius: 4px;
      border: none;
    }

    @media (max-width: 600px) {
      nav {
        flex-direction: column;
        align-items: flex-start;
      }

      .locale-selector {
        margin-top: 10px;
        margin-left: 0;
      }

      label {
        display: none;
      }
    }
  `;
}

customElements.define('navigation-menu', NavigationMenu);
