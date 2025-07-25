import { toast } from 'react-toastify';

class EmployeeService {
  constructor() {
this.tableName = 'employee';
    this.apperClient = null;
  }

  getClient() {
    if (!this.apperClient) {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded. Please ensure the SDK script is loaded before using services.');
      }
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "startDate" } },
          { field: { Name: "status" } },
          { field: { Name: "profilePhoto" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "startDate" } },
          { field: { Name: "status" } },
          { field: { Name: "profilePhoto" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(employeeData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: employeeData.Name,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role,
        department: employeeData.department,
        startDate: employeeData.startDate,
        status: employeeData.status,
        profilePhoto: employeeData.profilePhoto || "",
        Tags: employeeData.Tags || "",
        Owner: employeeData.Owner ? parseInt(employeeData.Owner) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create employee ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, employeeData) {
    try {
      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        Name: employeeData.Name,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role,
        department: employeeData.department,
        startDate: employeeData.startDate,
        status: employeeData.status,
        profilePhoto: employeeData.profilePhoto,
        Tags: employeeData.Tags,
        Owner: employeeData.Owner ? parseInt(employeeData.Owner) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update employee ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete employee ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "startDate" } },
          { field: { Name: "status" } },
          { field: { Name: "profilePhoto" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "firstName", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "lastName", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "email", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "role", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "department", operator: "Contains", values: [query] }
              ]
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching employees:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "startDate" } },
          { field: { Name: "status" } },
          { field: { Name: "profilePhoto" } }
        ],
        where: [
          { FieldName: "department", Operator: "EqualTo", Values: [department] }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees by department:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "startDate" } },
          { field: { Name: "status" } },
          { field: { Name: "profilePhoto" } }
        ],
        where: [
          { FieldName: "status", Operator: "EqualTo", Values: [status] }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export default new EmployeeService();