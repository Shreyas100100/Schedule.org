import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Table, Container, Card, Spinner, Button, Modal, Form, Alert } from "react-bootstrap";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newVid, setNewVid] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usr"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setNewName(user.uName);
    setNewVid(user.vId);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, "usr", editUser.id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const existingUsersQuery = query(collection(db, "usr"), where("vId", "==", newVid));
        const existingUsersSnapshot = await getDocs(existingUsersQuery);
        
        if (existingUsersSnapshot.docs.length === 0 || (existingUsersSnapshot.docs.length === 1 && existingUsersSnapshot.docs[0].id === editUser.id)) {
          await updateDoc(userRef, {
            uName: newName,
            vId: newVid,
          });
          // Refresh users after edit
          const querySnapshot = await getDocs(collection(db, "usr"));
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
          setShowEditModal(false);
          setError("");
        } else {
          setError("vID must be unique");
        }
      }
    } catch (error) {
      console.error("Error updating user: ", error);
      setError("Error updating user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "usr", userId));
      // Refresh users after delete
      const querySnapshot = await getDocs(collection(db, "usr"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100" >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center"style={{paddingTop:"2rem"}}>
      <Card style={{ width: "100%", maxWidth: "800px", padding: "1rem", overflowX: "auto" }}>
        <Card.Title>
          <h2 style={{ textAlign: "center" }}>View Users</h2>
        </Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>User Name</th>
              <th>vID</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.uName}</td>
                <td>{user.vId}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(user)}>
                    Update
                  </Button>{" "}
                  </td><td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="newName">
            <Form.Label>New Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="newVid">
            <Form.Label>New vID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new vID"
              value={newVid}
              onChange={(e) => setNewVid(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
