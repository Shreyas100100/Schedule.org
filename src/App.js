import React from "react";
import { AuthProvider, useAuth } from "./context/UserAuthContext";
import { MDBFooter } from 'mdb-react-ui-kit';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Nvbr from "./Navbar/Navbar";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Op2 from "./pages/View/ViewItems";
import Profile from "./pages/Profile";
import AddUser from "./pages/add/AddUser";
import AddItem from "./pages/add/AddItem";
import AddTask from "./pages/add/AddTask";
import ViewItems from "./pages/View/ViewItems";
import ViewTasks from "./pages/View/ViewTasks";
import ViewUsers from "./pages/View/ViewUsers";
import MyTasks from "./MyTasks";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (user === null) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Nvbr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/signup" element={<Navigate to="/" />} />
          <Route path="/addItem" element={<AddItem />} />
          <Route path="/addTask" element={<AddTask />} />
          <Route path="/viewItems" element={<ViewItems />} />
          <Route path="/viewTasks" element={<ViewTasks />} />
          <Route path="/viewUsers" element={<ViewUsers />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myTasks" element={<MyTasks />} />
        </Routes>
        <MDBFooter bgColor="light" className="text-center text-lg-left mt-auto">
          <div
            className="text-center p-3"
            
          >
            &copy; {new Date().getFullYear()} Copyright :{" "}
            <a>
              Shreyas Shripad Kulkarni
            </a>
          </div>
        </MDBFooter>
      </div>
    );
  }
};

export default App;
