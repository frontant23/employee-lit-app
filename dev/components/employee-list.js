import {LitElement, html, css} from 'lit';
import {store} from '../store.js';
import {Router} from '@vaadin/router';
import localeData from './employee-list-locales';

export class EmployeeList extends LitElement {
  constructor() {
    super();
    this.currentPage = 1;
    this.itemsPerPage = 3;
    this.viewMode = 'table';
    this.searchQuery = '';
    this.currentLanguage = 'en';
    document.addEventListener('locale-changed', this.updateLocale.bind(this));
  }

  updateLocale(event) {
    this.currentLanguage = event.detail;
    this.requestUpdate();
  }

  render() {
    const strings = localeData[this.currentLanguage];
    const totalEmployees = store.employees.length;
    const filteredEmployees = this.getFilteredEmployees();
    const totalResults = filteredEmployees.length;
    const totalPages = Math.ceil(totalResults / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    return html`
      <h2>${strings.title.employeeList}</h2>
      <div class="search-toggle-container">
        <input
          type="text"
          placeholder="${strings.placeholder.search}"
          @input="${this.handleSearch}"
          .value="${this.searchQuery}"
        />
        <button class="toggle-btn" @click="${this.toggleView}">
          ${strings.buttonText.toggleView}:${this.viewMode === 'table'
            ? strings.viewMode.list
            : strings.viewMode.table}
        </button>
      </div>
      <p>
        ${`Showing ${totalResults} result${
          totalResults !== 1 ? 's' : ''
        } out of ${totalEmployees} total employees.`}
      </p>

      ${this.viewMode === 'table'
        ? html`
            <div style="overflow-x:auto;">
              <table>
                <tr>
                  <th>${strings.tableHeaders.firstName}</th>
                  <th>${strings.tableHeaders.lastName}</th>
                  <th>${strings.tableHeaders.employmentDate}</th>
                  <th>${strings.tableHeaders.birthDate}</th>
                  <th>${strings.tableHeaders.phoneNumber}</th>
                  <th>${strings.tableHeaders.email}</th>
                  <th>${strings.tableHeaders.department}</th>
                  <th>${strings.tableHeaders.position}</th>
                  <th>${strings.tableHeaders.actions}</th>
                </tr>
                ${currentEmployees.map(
                  (emp) => html`
                    <tr>
                      <td>${emp.firstName}</td>
                      <td>${emp.lastName}</td>
                      <td>${emp.employmentDate}</td>
                      <td>${emp.birthDate}</td>
                      <td>${emp.phoneNumber}</td>
                      <td>${emp.email}</td>
                      <td>${emp.department}</td>
                      <td>${emp.position}</td>
                      <td>
                        <div class="actions">
                          <button @click="${() => this.editEmployee(emp.id)}">
                            ${strings.buttonText.edit}
                          </button>
                          <button @click="${() => this.deleteEmployee(emp.id)}">
                            ${strings.buttonText.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `
                )}
              </table>
            </div>
          `
        : html`
            <ul class="list-view">
              ${currentEmployees.map(
                (emp) => html`
                  <li>
                    <div class="employee-info">
                      <strong class="list-view-name"
                        >${emp.firstName} ${emp.lastName}</strong
                      >
                      <div>
                        <span
                          ><strong>${strings.labels.employmentDate}:</strong>
                          ${emp.employmentDate}</span
                        >
                      </div>
                      <div>
                        <span
                          ><strong>${strings.labels.birthDate}:</strong>
                          ${emp.birthDate}</span
                        >
                      </div>
                      <div>
                        <span
                          ><strong>${strings.labels.phoneNumber}:</strong>
                          ${emp.phoneNumber}</span
                        >
                      </div>
                      <div>
                        <span
                          ><strong>${strings.labels.email}:</strong>
                          ${emp.email}</span
                        >
                      </div>
                      <div>
                        <span
                          ><strong>${strings.labels.department}:</strong>
                          ${emp.department}</span
                        >
                      </div>
                      <div>
                        <span
                          ><strong>${strings.labels.position}:</strong>
                          ${emp.position}</span
                        >
                      </div>
                    </div>
                    <div class="actions">
                      <button @click="${() => this.editEmployee(emp.id)}">
                        ${strings.buttonText.edit}
                      </button>
                      <button @click="${() => this.deleteEmployee(emp.id)}">
                        ${strings.buttonText.delete}
                      </button>
                    </div>
                  </li>
                `
              )}
            </ul>
          `}

      <div class="pagination">
        <button ?disabled="${this.currentPage === 1}" @click="${this.prevPage}">
          ${strings.buttonText.previous}
        </button>
        <span
          >${strings.pagination.page} ${this.currentPage} / ${totalPages}</span
        >
        <button
          ?disabled="${this.currentPage === totalPages}"
          @click="${this.nextPage}"
        >
          ${strings.buttonText.next}
        </button>
      </div>
    `;
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1;
    this.requestUpdate();
  }

  getFilteredEmployees() {
    if (!this.searchQuery) {
      return store.employees;
    }
    return store.employees.filter((emp) => {
      return (
        emp.firstName.toLowerCase().includes(this.searchQuery) ||
        emp.lastName.toLowerCase().includes(this.searchQuery) ||
        emp.email.toLowerCase().includes(this.searchQuery) ||
        emp.phoneNumber.includes(this.searchQuery)
      );
    });
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'list' : 'table';
    this.requestUpdate();
  }

  nextPage() {
    this.currentPage++;
    this.requestUpdate();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.requestUpdate();
    }
  }

  editEmployee(id) {
    Router.go(`/edit/${id}`);
  }

  deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
      store.deleteEmployee(id);
      this.requestUpdate();
    }
  }

  static styles = css`
    table {
      width: 100%;
      min-width: 1400px;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    .list-view {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .list-view li {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .list-view-name {
      display: block;
      margin-bottom: 16px;
    }

    .employee-info {
      flex-grow: 1;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    @media (min-width: 600px) {
      .list-view li {
        flex-direction: row;
        justify-content: space-between;
      }

      .employee-info {
        flex-grow: 1;
      }
    }

    @media (max-width: 600px) {
      .list-view li {
        flex-direction: column;
      }

      .list-view .actions {
        justify-content: flex-end;
      }
    }

    .employee-info {
      flex-grow: 1;
    }

    .employee-info div {
      margin-bottom: 5px;
    }

    .actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .actions button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .actions button:hover {
      background-color: #0056b3;
    }

    .actions button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
      gap: 15px;
    }

    .pagination button {
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .pagination button:hover:not(:disabled) {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .pagination button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .pagination span {
      font-size: 16px;
      color: #555;
    }

    .search-toggle-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    input[type='text'] {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100%;
      max-width: 400px;
      margin-right: 10px;
    }

    input[type='text']:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .toggle-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .toggle-btn:hover {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .toggle-btn:focus {
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    @media (max-width: 600px) {
      .search-toggle-container {
        flex-direction: column;
        align-items: flex-start;
      }

      input[type='text'] {
        margin-right: 0;
        margin-bottom: 10px;
        width: calc(100% - 24px);
      }

      .toggle-btn {
        width: 100%;
      }
    }
  `;
}

customElements.define('employee-list', EmployeeList);
