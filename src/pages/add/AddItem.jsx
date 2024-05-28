import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Form, Card, Container, Row, Col, Button } from "react-bootstrap";
import { nanoid } from "nanoid";  // Import nanoid

export default function AddItemAndvariety() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [variety, setvariety] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitItem = async (e) => {
    e.preventDefault();

    if (!itemName) {
      setSnackbarMessage("All fields are required.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const productId = nanoid(5);  // Generate a short, unique productId

      // Add item document with userId, itemName, itemDescription, and productId
      await setDoc(doc(db, "item", productId), {
        userId,
        itemName,
        itemDescription,
        productId,  // Include productId
      });

      setSnackbarMessage("Item added successfully!");
      setSeverity("success");
      setOpenSnackbar(true);
      setItemName("");
      setItemDescription("");
    } catch (error) {
      console.error("Error adding item: ", error);
      setSnackbarMessage("Failed to add item. Please try again.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmitvariety = async (e) => {
    e.preventDefault();

    if (!variety) {
      setSnackbarMessage("variety is required.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const varietyId = nanoid(5);  // Generate a short, unique varietyId

      // Add variety document with userId and variety
      await setDoc(doc(db, "varieties", varietyId), {
        userId,
        variety,
        varietyId,  // Include varietyId
      });

      setSnackbarMessage("variety added successfully!");
      setSeverity("success");
      setOpenSnackbar(true);
      setvariety("");
    } catch (error) {
      console.error("Error adding variety: ", error);
      setSnackbarMessage("Failed to add variety. Please try again.");
      setSeverity("error");
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
    <div>
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{paddingTop:"3rem"}}>
        <Row className="w-100">
          <Col md={6} className="d-flex justify-content-center">
            <Card style={{ alignItems: "center", width: "18rem", marginBottom: "2rem" }}>
              <Card.Title>
                <h2 style={{ textAlign: "center", paddingTop: "2rem" }}>
                  Add Item
                </h2>
              </Card.Title>
              <Form onSubmit={handleSubmitItem}>
                <Col style={{ alignContent: "center", paddingTop: "2rem", width: "100%" }}>
                  <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col style={{ alignContent: "center", paddingTop: "2rem", width: "100%" }}>
                  <Form.Group>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Row className="justify-content-center" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                  <Col className="text-center">
                    <Button variant="primary" className="mt-3" type="submit" style={{ borderRadius: "0.4rem", width: "12rem" }}>
                      ADD Item
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <Card style={{ alignItems: "center", width: "18rem" }}>
              <Card.Title>
                <h2 style={{ textAlign: "center", paddingTop: "2rem" }}>
                  Add Variety
                </h2>
              </Card.Title>
              <Form onSubmit={handleSubmitvariety}>
                <Col style={{ alignContent: "center", paddingTop: "2rem", width: "100%" }}>
                  <Form.Group>
                    <Form.Label>Variety</Form.Label>
                    <Form.Control
                      type="text"
                      value={variety}
                      onChange={(e) => setvariety(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Row className="justify-content-center" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                  <Col className="text-center">
                    <Button variant="primary" className="mt-3" type="submit" style={{ borderRadius: "0.4rem", width: "12rem" }}>
                      Add Variety
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={severity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
