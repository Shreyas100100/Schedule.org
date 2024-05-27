import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Form, Card, Container, Button, Table, Spinner } from "react-bootstrap";

export default function MyTasks() {
  const [vId, setVId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchTasks = async () => {
    if (!vId) {
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "tasks"), where("vId", "==", vId));
      const querySnapshot = await getDocs(q);

      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchTasks();
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <h2 style={{ textAlign: "center", paddingTop: "2rem" }}>Schedule</h2>
      <Card
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "1rem",
          marginBottom: "1rem",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Form onSubmit={handleSubmit} className="d-flex flex-column w-100">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={vId}
              onChange={(e) => setVId(e.target.value)}
              placeholder="Enter vId"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Fetch Tasks
          </Button>
        </Form>
      </Card>

      <Container className="d-flex flex-column justify-content-center align-items-center">
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : tasks.length === 0 ? (
          <Card style={{ width: "100%", maxWidth: "600px", marginTop: "2rem" }}>
            <Card.Body>
              <Card.Title style={{ textAlign: "center" }}>No Schedule!</Card.Title>
            </Card.Body>
          </Card>
        ) : (
          <Card
            style={{
              width: "100%",
              maxWidth: "800px",
              padding: "1rem",
              marginTop: "2rem",
              margin: "auto",
              overflowX: "auto",
            }}
          >
            <Card.Title>
              <h2 style={{ textAlign: "center" }}>PRIORITY</h2>
            </Card.Title>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Item Owner</th>
                  <th>Item Owner ID</th>
                  <th>Assigned At</th>
                  <th>Voltage</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.itemName}</td>
                    <td>{task.itemOwner}</td>
                    <td>{task.vId}</td>
                    <td>{new Date(task.assignedAt).toLocaleString()}</td>
                    <td>{task.voltage}</td>
                    <td>{task.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </Container>
  );
}
