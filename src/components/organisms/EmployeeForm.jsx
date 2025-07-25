import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const EmployeeForm = ({ employee, onSubmit, onCancel, departments = [] }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    startDate: "",
    status: "Active",
    profilePhoto: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
        department: employee.department || "",
        startDate: employee.startDate || "",
        status: employee.status || "Active",
        profilePhoto: employee.profilePhoto || ""
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="UserPlus" className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
            placeholder="Enter first name"
          />
          
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
            placeholder="Enter last name"
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
          />
          
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="Enter phone number"
          />
          
          <Input
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            error={errors.role}
            placeholder="Enter job role"
          />
          
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            error={errors.department}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.Id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </Select>
          
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            error={errors.startDate}
          />
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </Select>
        </div>

        <Input
          label="Profile Photo URL (Optional)"
          value={formData.profilePhoto}
          onChange={(e) => handleChange("profilePhoto", e.target.value)}
          placeholder="Enter photo URL"
        />

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {employee ? "Update Employee" : "Add Employee"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EmployeeForm;