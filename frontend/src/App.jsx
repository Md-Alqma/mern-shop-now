// Global Imports
import { useContext, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";

// Local Imports
import { Store } from "./Store";
import { getError } from "./utils";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";

// Pages Imports
import CartPage from "./pages/CartPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderListPage from "./pages/OrderListPage";
import ProductPage from "./pages/ProductPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProfilePage from "./pages/ProfilePage";
import ProductListPage from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
import SigninPage from "./pages/SigninPage";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import SignupPage from "./pages/SignupPage";
import SearchBox from "./components/SearchBox";
import SearchPage from "./pages/SearchPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";

// External Imports
import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer, toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGN_OUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <div
      className={
        sidebarIsOpen
          ? "d-flex flex-column site-container active-cont"
          : "d-flex flex-column site-container"
      }>
      {/* <ToastContainer position="bottom-center" limit={2} />
       */}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        limit={2}
        closeOnClick
        transition={Flip}
      />
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Button
              variant="dark"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
              <i className="fas fa-bars"></i>
            </Button>
            <LinkContainer to="/">
              <Navbar.Brand>ShopNow</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.length}
                      {/* {cart.cartItems.reduce((a,c) => a + c.quantity), 0} --> to see the product quantity in nav cart using reduce function with accumulator */}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderHistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div
        className={
          sidebarIsOpen
            ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
            : "side-navbar d-flex justify-content-between flex-wrap flex-column"
        }>
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Categories</strong>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                to={{
                  pathname: "/search",
                  search: `category=${category}`,
                }}
                onClick={() => setSidebarIsOpen(false)}>
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </div>
      <main>
        <Container className="mt-3">
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />
            <Route path="/shipping" element={<ShippingAddressPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoutes>
                  <OrderPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoutes>
                  <OrderHistoryPage />
                </ProtectedRoutes>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderListPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditPage />
                </AdminRoute>
              }
            />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Container>
      </main>
      <footer>
        <div className="text-center">All right reserved</div>
      </footer>
    </div>
  );
}

export default App;
