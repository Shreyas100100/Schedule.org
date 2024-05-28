import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  Form, Container, Card, Button, Table, Spinner, Modal,
} from "react-bootstrap";
import './ViewItems.css'; // Import custom CSS

export default function ViewItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");

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
    const fetchItems = async () => {
      try {
        if (userId) {
          const q = query(
            collection(db, "item"),
            where("userId", "==", userId)
          );
          const querySnapshot = await getDocs(q);
          const itemsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(itemsList);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching items: ", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]);

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "item", itemId));
      setItems(items.filter((item) => item.id !== itemId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowDeleteModal = (itemId) => {
    setShowDeleteModal(true);
    setDeleteItemId(itemId);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
    setNewItemName("");
  };

  const handleShowEditModal = (item) => {
    setShowEditModal(true);
    setEditItem(item);
    setNewItemName(item.itemName);
  };

  const handleUpdateItem = async () => {
    try {
      await updateDoc(doc(db, "item", editItem.id), {
        itemName: newItemName,
      });
      const updatedItems = items.map((item) =>
        item.id === editItem.id ? { ...item, itemName: newItemName } : item
      );
      setItems(updatedItems);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
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
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{paddingTop:"2rem"}}>
      <Card className="w-100" style={{ borderRadius: "1rem", maxWidth: "600px" }}>
        <Card.Body className="text-center p-4 ">
          <Card.Title>Item List</Card.Title>
          <div className="table-responsive">
            <Table striped bordered hover className="table-fixed">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Item Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleShowDeleteModal(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleShowEditModal(item)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteItemId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateItem}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
