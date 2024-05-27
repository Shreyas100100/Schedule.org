import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // customize the primary color
    },
  },
});

export default function Nvbr() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                color: "inherit",
                textDecoration: "none",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              SCHEDULE.ORG
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  component={Link}
                  to="/addItem"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">Add Item</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/addTask"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">Add Task</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/addUser"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">Add User</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/viewItems"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">View Items</Typography>
                </MenuItem>
                
                
                <MenuItem
                  component={Link}
                  to="/viewTasks"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">View Tasks</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/viewUsers"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">View Users</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/myTasks"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">Schedule</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                component={Link}
                to="/addItem"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Add Item
              </Button>
              <Button
                component={Link}
                to="/addTask"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Add Task
              </Button>
              <Button
                component={Link}
                to="/addUser"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Add User
              </Button>
              <Button
                component={Link}
                to="/viewItems"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                View Items
              </Button>
              <Button
                component={Link}
                to="/viewTasks"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                View Tasks
              </Button>
              <Button
                component={Link}
                to="/viewUsers"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                View Users
              </Button>
              <Button
                component={Link}
                to="/myTasks"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Schedule
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    {user ? user.email.charAt(0).toUpperCase() : ""}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography textAlign="center">
                    {user ? user.email : "Guest"}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/profile");
                  }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/account");
                  }}
                >
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/dashboard");
                  }}
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    auth.signOut();
                    handleCloseUserMenu();
                    navigate("/");
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
