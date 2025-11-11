import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ShoppingCartIcon, StoreIcon, BuildingIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

export function SignUpForm() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedRole, setSelectedRole] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!selectedRole) {
      newErrors.role = "Please select a role";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const name = `${formData.firstName} ${formData.lastName}`;

      const payload = {
        name: name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };
        
      setLoading(true);

      await fetch("http://localhost:5001/auth/register",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(response=>{
        return response.json()
      }).then(data=>{
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          toast.success("User registered successfully");
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("role", data.role);
          navigate('/', {replace: true});
          window.location.reload();
        }
      })
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-2">
        <Form.Group controlId="firstName" className="w-1/2">
          <Form.Control
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="py-2 px-3 rounded-lg w-full border border-gray-300"
            required
          />
          {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
        </Form.Group>

        <Form.Group controlId="lastName" className="w-1/2">
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="py-2 px-3 rounded-lg w-full border border-gray-300"
            required
          />
          {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
        </Form.Group>
      </div>

      <Form.Group controlId="email">
        <Form.Control
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="py-2 px-3 rounded-lg w-full border border-gray-300"
          required
        />
        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="py-2 px-3 rounded-lg w-full border border-gray-300"
          required
        />
        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="py-2 px-3 rounded-lg w-full border border-gray-300"
          required
        />
        {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
      </Form.Group>

      <p className="text-blue-600 text-center">Please select your role from the options below:</p>

      <Form.Group>
        {errors.role && <div className="text-red-500 text-sm text-center mb-2">{errors.role}</div>}
        {errors.apiError && <div className="text-red-500 text-sm text-center mb-2">{errors.apiError}</div>}
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border ${
              selectedRole === "Seller"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => selectRole("Seller")}
          >
            <StoreIcon className="h-4 w-4 mr-1" />
            <span>Seller</span>
          </button>

          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border ${
              selectedRole === "Buyer"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => selectRole("Buyer")}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            <span>Buyer</span>
          </button>

          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border ${
              selectedRole === "FSH"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => selectRole("FSH")}
          >
            <BuildingIcon className="h-4 w-4 mr-1" />
            <span>FSH</span>
          </button>
        </div>
      </Form.Group>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
        {isLoading ?  <Loader/> :"Create Account"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="./sign-in" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </Form>
  );
}
