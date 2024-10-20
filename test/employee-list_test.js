import {EmployeeList} from '../dev/components/employee-list.js';
import {fixture, assert, expect} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../dev/store.js';

const mockEmployees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    employmentDate: '2020-01-01',
    birthDate: '1990-01-01',
    phoneNumber: '123-456-7890',
    email: 'john.doe@example.com',
    department: 'HR',
    position: 'Manager',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    employmentDate: '2023-01-02',
    birthDate: '1988-07-22',
    phoneNumber: '555-555-0002',
    email: 'bob.smith@example.com',
    department: 'Tech',
    position: 'Senior',
  },
];

suite('employee-list', () => {
  setup(() => {
    store.employees = mockEmployees;
  });

  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders employee list with default values', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    assert.shadowDom.equal(
      el,
      `
      <h2>Employee List</h2>
      <div class="search-toggle-container">
        <input type="text" placeholder="Search employees..."/>
        <button class="toggle-btn">Switch to:List View</button>
      </div>
      <p>Showing 2 results out of 2 total employees.</p>
      <div style="overflow-x:auto;">
        <table>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Emp. Date</th>
            <th>Birth Date</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
          <tr>
            <td>
              John
            </td>
            <td>
              Doe
            </td>
            <td>
              2020-01-01
            </td>
            <td>
              1990-01-01
            </td>
            <td>
              123-456-7890
            </td>
            <td>
              john.doe@example.com
            </td>
            <td>
              HR
            </td>
            <td>
              Manager
            </td>
            <td>
              <div class="actions">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              Bob
            </td>
            <td>
              Smith
            </td>
            <td>
              2023-01-02
            </td>
            <td>
              1988-07-22
            </td>
            <td>
              555-555-0002
            </td>
            <td>
              bob.smith@example.com
            </td>
            <td>
              Tech
            </td>
            <td>
              Senior
            </td>
            <td>
              <div class="actions">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="pagination">
        <button disabled="">Previous</button>
        <span>Page 1 / 1</span>
        <button disabled="">Next</button>
      </div>
      `
    );
  });

  test('handles search input', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const searchInput = el.shadowRoot.querySelector('input[type="text"]');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p')).dom.to.equal(
      '<p>Showing 1 result out of 2 total employees.</p>'
    );
  });

  test('toggles view mode', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const toggleButton = el.shadowRoot.querySelector('.toggle-btn');

    toggleButton.click();
    await el.updateComplete;

    const listView = el.shadowRoot.querySelector('.list-view');
    assert.exists(listView, 'List view should be rendered');
  });

  test('pagination works correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    const nextButton = el.shadowRoot.querySelector(
      '.pagination button:nth-child(3)'
    );
    assert.isTrue(nextButton.disabled, 'Next button should be disabled');
  });

  test('deletes employee', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    window.confirm = () => true;

    const deleteButton = el.shadowRoot.querySelector(
      'table button:nth-child(2)'
    );
    deleteButton.click();
    await el.updateComplete;

    assert.equal(store.employees.length, 1, 'There should be 1 employee left');
  });

  test('locale update works', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const event = new CustomEvent('locale-changed', {detail: 'tr'});
    document.dispatchEvent(event);
    await el.updateComplete;

    assert.equal(
      el.currentLanguage,
      'tr',
      'Current language should be set to Turkish'
    );
  });
});
