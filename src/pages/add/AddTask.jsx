import React, { useState, useEffect } from "react";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Form, Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { nanoid } from "nanoid";

export default function AddTask() {
  const [product, setProduct] = useState("");
  const [itemOwner, setItemOwner] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [userId, setUserId] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [products, setProducts] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedAt, setAssignedAt] = useState("");
  const [quantity, setQuantity] = useState("");
  const [variety, setvariety] = useState("");
  const [remarks, setRemarks] = useState("");

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

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usr"));
        const names = querySnapshot.docs
          .map((doc) => {
            const userData = doc.data();
            return { name: userData.uName, vId: userData.vId, userId: userData.userId };
          })
          .filter((user) => user.userId === userId);
        setUserNames(names);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user names: ", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserNames();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "item"));
        const productList = querySnapshot.docs
          .map((doc) => {
            const itemData = doc.data();
            return { itemId: doc.id, itemName: itemData.itemName, userId: itemData.userId };
          })
          .filter((item) => item.userId === userId);
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "varieties"));
        const varietyList = querySnapshot.docs
          .map((doc) => {
            const varietyData = doc.data();
            return { variety: varietyData.variety, userId: varietyData.userId };
          })
          .filter((v) => v.userId === userId)
          .map((v) => v.variety);
        setVarieties(varietyList);
      } catch (error) {
        console.error("Error fetching varieties: ", error);
      }
    };

    if (userId) {
      fetchVarieties();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !itemOwner || !assignedAt || !quantity || !variety ) {
      setSnackbarMessage("All fields are required.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const selectedUser = userNames.find((user) => user.name === itemOwner);

      if (!selectedUser || !selectedUser.vId) {
        throw new Error("Owner not found or missing vId.");
      }

      await setDoc(doc(collection(db, "tasks")), {
        userId,
        itemId: products.find((p) => p.itemName === product)?.itemId || "",
        itemName: product,
        itemOwner,
        assignedAt,
        quantity,
        variety,
        remarks,
        vId: selectedUser.vId,
      });

      setSnackbarMessage("Task added successfully!");
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding task: ", error);
      setSnackbarMessage("Failed to add task. Please try again.");
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div>
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ paddingTop: "3rem" }}>
        <Card style={{ alignItems: "center", width: "100%", maxWidth: "60rem" }}>
          <Card.Title>
            <h2 style={{ textAlign: "center", paddingTop: "2rem" }}>
              Add Task
            </h2>
          </Card.Title>
          <Form onSubmit={handleSubmit} style={{ width: "100%", padding: "1rem" }}>
            <Row>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Choose Product</Form.Label>
                  <Form.Select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    aria-label="Choose Product"
                  >
                    <option value="">Choose Product</option>
                    {products.map((item, index) => (
                      <option key={index} value={item.itemName}>
                        {item.itemName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Select Owner Name</Form.Label>
                  <Form.Select
                    value={itemOwner}
                    onChange={(e) => setItemOwner(e.target.value)}
                    aria-label="Select owner name"
                  >
                    <option value="">Select owner name</option>
                    {userNames.map((data, index) => (
                      <option key={index} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Assigned at</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignedAt}
                    onChange={(e) => setAssignedAt(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                />
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Label>Variety</Form.Label>
                <Form.Select
                  value={variety}
                  onChange={(e) => setvariety(e.target.value)}
                  aria-label="Choose Variety"
                >
                  <option value="">Choose Variety</option>
                  {varieties.map((v, index) => (
                    <option key={index} value={v}>
                      {v}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Remarks"
                />
              </Col>
            </Row>
            <Row className="justify-content-center" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
              <Col className="text-center">
                <Button
                  variant="primary"
                  className="mt-3"
                  type="submit"
                  style={{ borderRadius: "0.4rem", width: "12rem" }}
                >
                  Add Task
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={severity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
