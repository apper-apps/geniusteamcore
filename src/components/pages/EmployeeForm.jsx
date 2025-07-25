import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";
import { toast } from "react-toastify";

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isEditing = Boolean(id);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const departmentsData = await departmentService.getAll();
      setDepartments(departmentsData);
      
      if (isEditing) {
        const employeeData = await employeeService.getById(id);
        setEmployee(employeeData);
      }
      
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await employeeService.update(id, formData);
        toast.success("Employee updated successfully");
      } else {
        await employeeService.create(formData);
        toast.success("Employee added successfully");
      }
      navigate("/employees");
    } catch (err) {
      toast.error(err.message || "Failed to save employee");
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <EmployeeForm
        employee={employee}
        departments={departments}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EmployeeFormPage;