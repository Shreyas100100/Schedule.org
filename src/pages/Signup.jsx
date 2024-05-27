import React, { useState } from "react";
import { Form, Container, Card, Button, Row, Col } from "react-bootstrap";
import { TextField } from "@mui/material";
import logo from "../images/Logo.PNG";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
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
        style={{ width: "60rem", height: "23rem", borderRadius: "1rem" }}
        className="text-center p-4 shadow"
      >
        <Row>
          <Col>
            <div style={{ width: "20rem", height: "20rem", textAlign: "left" }}>
              <img src={logo} alt="Logo" className="mb-4" />
              <br></br>
              <h2>SIGN UP</h2>
              <br></br>
              <p>Create your HASHTAG Account</p>
            </div>
          </Col>
          <Col>
            <Row className="mb-2">
              <div>
                <Col>
                  <br style={{ paddingTop: "2rem" }}></br>
                  <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    style={{ height: "2.5rem", width: "30rem" }}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                </Col>
                <br style={{ paddingTop: "2rem" }}></br>
                <Col>
                  <TextField
                    type="password"
                    label="Password"
                    style={{ height: "2.5rem", width: "30rem" }}
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                  />
                </Col>
                <br style={{ paddingTop: "2rem" }}></br>
                <Col>
                  <TextField
                    type="password"
                    label="Confirm Password"
                    style={{ height: "3rem", width: "30rem" }}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword}
                  />
                </Col>
              </div>
            </Row>
            <br style={{ paddingTop: "3rem" }}></br>
            <div>
              <Row>
                <Col>
                  <br style={{ paddingTop: "3rem" }}></br>
                  <span>Already Registered ? </span>

                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Log In 
                  </Link>
                </Col>
                <br style={{ paddingTop: "3rem" }}></br>
                <Col style={{ paddingRight: "5rem" }}>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleSubmit}
                    style={{ borderRadius: "2rem", width: "6rem" }}
                  >
                    SIGN UP
                  </Button>
                </Col>
              </Row>
            </div>
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
