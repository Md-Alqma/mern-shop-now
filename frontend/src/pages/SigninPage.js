// Sign In Page

// Global Imports
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Local Imports
import { Store } from "../Store";
import { getError } from "../utils";

// External Imports
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  // const redirect = new URLSearchParams(search).get("redirect") || "/" or
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGN_IN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast("Login Successful", {
        type: "success",
        position: "top-right",
      });
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SigninPage;
