import React from "react";
import { Form, Button } from "react-bootstrap";
import Loader from "../../components/loader";

export function SignInForm({onSubmit, isLoading}) {
  return (
    <Form onSubmit={onSubmit} className="space-y-3">
      <Form.Group controlId="email">
        <Form.Control
          type="email"
          placeholder="Email"
          className="py-2 px-3 rounded-lg w-full border border-gray-300"
          required
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Control
          type="password"
          placeholder="Password"
          className="py-2 px-3 rounded-lg w-full border border-gray-300"
          required
        />
      </Form.Group>

      <br/>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        {isLoading ?  <Loader/> :"Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a href="./sign-up" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </Form>
  );
}