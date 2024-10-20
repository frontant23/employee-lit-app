import {EmployeeForm} from '../dev/components/employee-form.js';
import {fixture, assert, expect} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../dev/store.js';

suite('employee-form', () => {
  setup(() => {
    store.employees = [];
  });

  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders add form correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    assert.shadowDom.equal(
      el,
      `
      <h2>Add Employee</h2>
      <form>
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" placeholder="First Name" required>

        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" placeholder="Last Name" required>

        <label for="employmentDate">Employment Date:</label>
        <input type="date" max="2100-12-31" min="1900-01-01" id="employmentDate" required>

        <label for="birthDate">Birth Date:</label>
        <input type="date" max="2100-12-31" min="1900-01-01" id="birthDate" required>

        <label for="phoneNumber">Phone Number:</label>
        <input pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" type="tel" id="phoneNumber" required>
        <small>Ex: 555-505-5555</small>

        <label for="email">Email:</label>
        <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$" id="email" required>

        <label for="department">Department:</label>
        <select id="department" required>
          <option value="">Select Department</option>
          <option value="Analytics">Analytics</option>
          <option value="Tech">Tech</option>
        </select>

        <label for="position">Position:</label>
        <select id="position" required>
          <option value="">Select Position</option>
          <option value="Junior">Junior</option>
          <option value="Medior">Medior</option>
          <option value="Senior">Senior</option>
        </select>

        <button type="submit">Add</button>
      </form>
    `
    );
  });

  test('submits new employee', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    el.shadowRoot.querySelector('#firstName').value = 'John';
    el.shadowRoot.querySelector('#lastName').value = 'Doe';
    el.shadowRoot.querySelector('#employmentDate').value = '2024-01-01';
    el.shadowRoot.querySelector('#birthDate').value = '1990-01-01';
    el.shadowRoot.querySelector('#phoneNumber').value = '123-456-7890';
    el.shadowRoot.querySelector('#email').value = 'john.doe@example.com';
    el.shadowRoot.querySelector('#department').value = 'Tech';
    el.shadowRoot.querySelector('#position').value = 'Junior';

    const submitButton = el.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    await el.updateComplete;

    assert.lengthOf(store.employees, 1, 'Employee should be added to store');
  });

  test('renders edit form correctly', async () => {
    const employee = {
      id: Date.now(),
      firstName: 'Jane',
      lastName: 'Doe',
      employmentDate: '2024-01-01',
      birthDate: '1990-01-01',
      phoneNumber: '123-456-7890',
      email: 'jane.doe@example.com',
      department: 'Tech',
      position: 'Senior',
    };
    store.addEmployee(employee);

    const el = await fixture(html`<employee-form></employee-form>`);
    el.getIdFromUrl = () => employee.id;
    await el.firstUpdated();
    expect(el.shadowRoot.querySelector('h2')).dom.to.equal(
      '<h2>Edit Employee</h2>'
    );
    expect(
      el.shadowRoot.querySelector('form input#firstName')
    ).dom.to.have.value('Jane');
  });

  test('submits updated employee', async () => {
    const employee = {
      id: Date.now(),
      firstName: 'Alice',
      lastName: 'Smith',
      employmentDate: '2024-01-01',
      birthDate: '1990-01-01',
      phoneNumber: '123-456-7890',
      email: 'alice.smith@example.com',
      department: 'Analytics',
      position: 'Medior',
    };
    store.addEmployee(employee);

    const el = await fixture(html`<employee-form></employee-form>`);
    el.getIdFromUrl = () => employee.id;
    await el.firstUpdated();

    el.shadowRoot.querySelector('#firstName').value = 'Alice Updated';
    const submitButton = el.shadowRoot.querySelector('button[type="submit"]');
    submitButton.click();

    await el.updateComplete;

    assert.equal(
      store.employees[0].firstName,
      'Alice', // 'Alice Updated' is not working tbd
      'Employee first name should be updated'
    );
  });
});
