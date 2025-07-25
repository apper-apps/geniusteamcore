import departmentsData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.departments];
  }

  async getById(id) {
    await this.delay();
    const department = this.departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  }

  async create(departmentData) {
    await this.delay();
    const maxId = Math.max(...this.departments.map(dept => dept.Id), 0);
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1,
      employeeCount: 0
    };
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    this.departments[index] = {
      ...this.departments[index],
      ...departmentData,
      Id: parseInt(id)
    };
    
    return { ...this.departments[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    const deleted = this.departments.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new DepartmentService();