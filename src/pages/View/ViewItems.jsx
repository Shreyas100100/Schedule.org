import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  Form,
  Container,
  Card,
  Button,
  Row,
  Col,
  Table,
  Spinner,
} from "react-bootstrap";

export default function ViewItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Construct a query to filter items based on userId
        const q = query(collection(db, "item"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const itemsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items: ", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchItems();
    }
  }, [userId]); // Fetch items when userId changes

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
      <Card
        style={{ width: "40rem", borderRadius: "1rem" }}
        className="text-center p-4 shadow"
      >
        <Card.Title>Item List</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Item Owner</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>{item.itemOwner}</td>
                {/* Add more table cells as needed */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
