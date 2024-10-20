import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import './dev/components/navigation-menu.js';
import './dev/components/employee-list.js';
import './dev/components/employee-form.js';

class AppShell extends LitElement {
  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    const router = new Router(outlet);

    router.setRoutes([
      {path: '/', component: 'employee-list'},
      {path: '/add', component: 'employee-form'},
      {path: '/edit/:id', component: 'employee-form'},
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <div id="outlet"></div>
    `;
  }
}

customElements.define('app-shell', AppShell);
