import {defaultEmployees} from './defaultEmployees.js';

export const store = {
  employees: JSON.parse(localStorage.getItem('employees')) || [],

  init() {
    if (this.employees.length === 0) {
      this.employees = defaultEmployees;
      this.save();
    }
  },

  addEmployee(employee) {
    this.employees.push(employee);
    this.save();
  },

  editEmployee(updatedEmployee) {
    const index = this.employees.findIndex(
      (emp) => emp.id === updatedEmployee.id
    );
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      this.save();
    }
  },

  deleteEmployee(id) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    this.save();
  },

  save() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  },
};

store.init();
