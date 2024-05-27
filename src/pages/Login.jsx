import React, { useState } from "react";
import { Form, Container, Card, Button, Row, Col } from "react-bootstrap";
import logo from "../images/Logo.PNG";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbarMessage("Login successful! Redirecting to Home...");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Login error:", error.message);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
              <h2>LOGIN</h2>
              <br></br>
              <p>Use Your Expense Tracker</p>
            </div>
          </Col>
          <Col>
            <Form
              onSubmit={handleSubmit}
              style={{ width: "30rem", paddingTop: "3rem" }}
            >
              <Row className="mb-2">
                <div>
                  <Col>
                    <Form.Control
                      type="email"
                      placeholder="Email or Phone"
                      style={{ height: "3rem" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Col>
                  <br style={{ paddingTop: "2rem" }}></br>
                  <Col>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      style={{ height: "3rem" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Col>
                  <div style={{ textAlign: "left" }}>
                    <Button
                      variant="link"
                      className="w-50 mt-3"
                      style={{
                        textDecoration: "none",
                        textAlign: "left",
                        paddingLeft: "0",
                      }}
                    >
                      Forgot password ?
                    </Button>
                  </div>
                </div>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="link"
                    className="w-100 mt-3"
                    style={{
                      textDecoration: "none",
                      textAlign: "left",
                      paddingLeft: "0",
                    }}
                  >
                    <Link to="/signup" style={{ textDecoration: "none" }}>
                      Create Account
                    </Link>
                  </Button>
                </Col>
                <Col style={{ paddingRight: "5rem" }}>
                  <Button
                    variant="primary"
                    className="mt-3"
                    type="submit"
                    style={{ borderRadius: "2rem", width: "6rem" }}
                  >
                    SIGN IN
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={
            snackbarMessage.includes("successful") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
