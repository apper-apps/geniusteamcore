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

  async checkIn(employeeId, location = null) {
    await this.delay();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Check if already checked in today
    const existingRecord = this.attendance.find(att => 
      att.employeeId === employeeId && att.date === today
    );
    
    if (existingRecord && existingRecord.checkInTime && !existingRecord.checkOutTime) {
      throw new Error("Already checked in today");
    }
    
    const checkInData = {
      Id: this.attendance.length + 1,
      employeeId,
      date: today,
      checkInTime: now.toTimeString().split(' ')[0],
      checkInLocation: location,
      status: "Present"
    };
    
    // Remove any existing incomplete record for today
    this.attendance = this.attendance.filter(att => 
      !(att.employeeId === employeeId && att.date === today)
    );
    
    this.attendance.push(checkInData);
    return checkInData;
  }

  async checkOut(employeeId, location = null) {
    await this.delay();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Find today's check-in record
    const recordIndex = this.attendance.findIndex(att => 
      att.employeeId === employeeId && 
      att.date === today && 
      att.checkInTime && 
      !att.checkOutTime
    );
    
    if (recordIndex === -1) {
      throw new Error("No active check-in found for today");
    }
    
    // Calculate work hours
    const checkInTime = new Date(`${today}T${this.attendance[recordIndex].checkInTime}`);
    const checkOutTime = now;
    const hoursWorked = Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60) * 100) / 100;
    
    // Update the record
    this.attendance[recordIndex] = {
      ...this.attendance[recordIndex],
      checkOutTime: now.toTimeString().split(' ')[0],
      checkOutLocation: location,
      hoursWorked
    };
    
    return this.attendance[recordIndex];
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