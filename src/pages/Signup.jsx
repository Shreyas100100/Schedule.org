import React, { useState } from "react";
import { Form, Container, Card, Button, Row, Col } from "react-bootstrap";
import { TextField } from "@mui/material";
import logo from "../images/logo.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSnackbarMessage("Sign up successful! Redirecting to login...");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect after 3 seconds
      } catch (error) {
        console.error("SignUp error:", error.message);
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
      }
    } else {
      setValidationErrors(errors);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      password: "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: "",
    }));
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Card
        style={{ width: "100%", maxWidth: "600px", borderRadius: "1rem" }}
        className="text-center p-4 shadow"
      >
        <Row>
          <Col xs={12} md={6}>
            <div className="text-left">
              <img src={logo} alt="Logo" className="mb-2" style={{height:"8rem"}}/>
              <h2>SIGN UP</h2>
              <p>SCHEDULE.ORG New User</p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                className="mb-2 w-100"
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                className="mb-2 w-100"
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
              <TextField
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="mb-3 w-100"
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
              />
              <Button variant="link" className="w-100 mb-3">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Already Registered ? Log In
                </Link>
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
              >
                SIGN UP
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="error"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
