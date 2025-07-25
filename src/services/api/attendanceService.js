import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getById(id) {
    await this.delay();
    const record = this.attendance.find(att => att.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async getByEmployeeId(employeeId) {
    await this.delay();
    return this.attendance.filter(att => att.employeeId === parseInt(employeeId));
  }

  async getByDate(date) {
    await this.delay();
    return this.attendance.filter(att => att.date === date);
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.attendance.filter(att => 
      att.date >= startDate && att.date <= endDate
    );
  }

  async create(attendanceData) {
    await this.delay();
    const maxId = Math.max(...this.attendance.map(att => att.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.attendance.findIndex(att => att.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    this.attendance[index] = {
      ...this.attendance[index],
      ...attendanceData,
      Id: parseInt(id)
    };
    
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(att => att.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const deleted = this.attendance.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new AttendanceService();