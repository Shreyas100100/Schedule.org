import React, { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Table, Container, Card, Button, Modal, Form, Spinner } from "react-bootstrap";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

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
    const fetchTasks = async () => {
      if (userId) {
        try {
          const q = query(collection(db, "tasks"), where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          const tasksList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksList);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching tasks: ", error);
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [userId]);

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (currentTask) {
      try {
        const taskDocRef = doc(db, "tasks", currentTask.id);
        await updateDoc(taskDocRef, currentTask);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
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
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Card style={{ width: "80%", padding: "2rem" }}>
        <Card.Title>
          <h2 style={{ textAlign: "center" }}>View Tasks</h2>
        </Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Item Owner</th>
              <th>Item Owner ID</th>
              <th>Assigned At</th>
              <th>Voltage</th>
              <th>Quantity</th>
              <th>Edit</th>
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
                <td>
                  <Button variant="warning" onClick={() => handleEditClick(task)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask && (
            <Form>
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="itemName"
                  value={currentTask.itemName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Item Owner</Form.Label>
                <Form.Control
                  type="text"
                  name="itemOwner"
                  value={currentTask.itemOwner}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Assigned At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="assignedAt"
                  value={new Date(currentTask.assignedAt).toISOString().substring(0, 16)}
                  onChange={handleEditChange}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Voltage</Form.Label>
                <Form.Control
                  type="text"
                  name="voltage"
                  value={currentTask.voltage}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  name="quantity"
                  value={currentTask.quantity}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
