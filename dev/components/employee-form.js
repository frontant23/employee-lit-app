import {LitElement, html, css} from 'lit';
import {store} from '../store.js';
import {Router} from '@vaadin/router';
import localeData from './employee-form-locales.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: {type: Object},
    isEditing: {type: Boolean},
  };

  constructor() {
    super();
    this.employee = {
      id: null,
      firstName: '',
      lastName: '',
      employmentDate: '',
      birthDate: '',
      phoneNumber: '',
      email: '',
      department: '',
      position: '',
    };
    this.isEditing = false;
    this.currentLanguage = document.documentElement.lang || 'en';
    document.addEventListener('locale-changed', this.updateLocale.bind(this));
  }

  updateLocale(event) {
    this.currentLanguage = event.detail;
    this.requestUpdate();
  }

  firstUpdated() {
    const id = this.getIdFromUrl();
    if (id) {
      this.loadEmployee(id);
      this.isEditing = true;
    }
  }

  render() {
    const strings = localeData[this.currentLanguage];

    return html`
      <h2>${this.isEditing ? strings.title.edit : strings.title.add}</h2>
      <form @submit="${this.handleSubmit}">
        <label for="firstName">${strings.formLabels.firstName}</label>
        <input
          type="text"
          id="firstName"
          placeholder="${strings.placeholders.firstName}"
          .value="${this.employee.firstName}"
          @input="${(e) => (this.employee.firstName = e.target.value)}"
          required
        />

        <label for="lastName">${strings.formLabels.lastName}</label>
        <input
          type="text"
          id="lastName"
          placeholder="${strings.placeholders.lastName}"
          .value="${this.employee.lastName}"
          @input="${(e) => (this.employee.lastName = e.target.value)}"
          required
        />

        <label for="employmentDate">${strings.formLabels.employmentDate}</label>
        <input
          type="date"
          id="employmentDate"
          .value="${this.employee.employmentDate}"
          min="1900-01-01"
          max="2100-12-31"
          @input="${(e) => (this.employee.employmentDate = e.target.value)}"
          required
        />

        <label for="birthDate">${strings.formLabels.birthDate}</label>
        <input
          type="date"
          id="birthDate"
          .value="${this.employee.birthDate}"
          min="1900-01-01"
          max="2100-12-31"
          @input="${(e) => (this.employee.birthDate = e.target.value)}"
          required
        />

        <label for="phoneNumber">${strings.formLabels.phoneNumber}</label>
        <input
          type="tel"
          id="phoneNumber"
          .value="${this.employee.phoneNumber}"
          @input="${(e) => (this.employee.phoneNumber = e.target.value)}"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
        />
        <small>Ex: ${strings.placeholders.phoneNumber}</small>

        <label for="email">${strings.formLabels.email}</label>
        <input
          type="email"
          id="email"
          .value="${this.employee.email}"
          @input="${(e) => (this.employee.email = e.target.value)}"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
          required
        />

        <label for="department">${strings.formLabels.department}</label>
        <select
          id="department"
          .value="${this.employee.department}"
          @change="${(e) => (this.employee.department = e.target.value)}"
          required
        >
          <option value="">${strings.selectOptions.department.default}</option>
          <option value="Analytics">
            ${strings.selectOptions.department.analytics}
          </option>
          <option value="Tech">${strings.selectOptions.department.tech}</option>
        </select>

        <label for="position">${strings.formLabels.position}</label>
        <select
          id="position"
          .value="${this.employee.position}"
          @change="${(e) => (this.employee.position = e.target.value)}"
          required
        >
          <option value="">${strings.selectOptions.position.default}</option>
          <option value="Junior">
            ${strings.selectOptions.position.junior}
          </option>
          <option value="Medior">
            ${strings.selectOptions.position.medior}
          </option>
          <option value="Senior">
            ${strings.selectOptions.position.senior}
          </option>
        </select>

        <button type="submit">
          ${this.isEditing ? strings.buttonText.update : strings.buttonText.add}
        </button>
      </form>
    `;
  }

  handleSubmit(event) {
    event.preventDefault();
    const isEditing = this.isEditing;
    if (isEditing) {
      store.editEmployee(this.employee);
    } else {
      this.employee.id = Date.now();
      store.addEmployee(this.employee);
    }
    Router.go('/');
  }

  getIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length !== 3) {
      return;
    }
    return pathParts[pathParts.length - 1];
  }

  loadEmployee(id) {
    const employee = store.employees.find((emp) => emp.id === parseInt(id));
    if (employee) {
      this.employee = {...employee};
    }
  }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    label {
      font-weight: bold;
      color: #555;
      margin-bottom: -10px;
    }

    input,
    select {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }

    input:focus,
    select:focus {
      border-color: #007bff;
      outline: none;
    }

    small {
      color: #777;
      font-size: 14px;
      margin-top: -10px;
    }

    button {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `;
}

customElements.define('employee-form', EmployeeForm);
