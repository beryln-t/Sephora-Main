import React from "react";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@popperjs/core/dist/umd/popper.min.js";
import Header from "../components/Header/Header";
import AppointmentPage from "./Appoinments/AppointmentPage";
import Map from "./Map/Map";
import SignUpForm from "./AuthPage/SignUpForm";
import UpcomingAppointment from "./UpcomingAppointment/UpcomingAppointment";
import Admin from "./MakeupAdmin/Admin";
import MakeupArtist from "./MakeupAdmin/MakeupArtist";
import NewArtist from "./MakeupAdmin/NewArtist";
import Edit from "./MakeupAdmin/Edit";
import { getUser } from "../utilities/users-service";

import SelectedProductPage from "./Products/SelectedProductPage";
import AddProductsForm from "./ProductsForm/AddProductsForm";
import InventoryManagement from "./InventoryManagement/InventoryManagement";
import InventoryAdd from "./InventoryAdd/InventoryAdd";
import EditProductsForm from "./ProductsForm/EditProductsForm";
import ProductsForm from "./ProductsForm/ProductsForm";
import ProductsPage from "./Products/ProductsPage";

import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import ForgetPassword from "./AuthPage/ForgetPassword";

import LoginForm from "./AuthPage/LoginForm";
import WithCustomerNavTools from "../components/WithCustomerBanner";
import WithNavBar from "../components/WithNavBar";
import { Link } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [products, setProducts] = useState([]);
  const [sortByCategory, setSortByCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const token = localStorage.getItem("token");
  const customer = token ? JSON.parse(window.atob(token.split(".")[1])) : null;

  const addProduct = (product, error) => {
    if (error) {
      // Handle the error, e.g. display an error message
      console.error(error);
      return;
    }
    // Add the product to the products list
    setProducts(products.concat(product));
  };
  const delProduct = (id) =>
    setProducts(products.filter(({ _id }) => _id !== id));

  const handleEditProduct = (editedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === editedProduct._id ? editedProduct : product
      )
    );
  };

  useEffect(() => {
    const categories = [...new Set(products.map((p) => p.category))];
    setCategory(categories);

    const brands = [...new Set(products.map((p) => p.brand))];
    setBrand(brands);
  }, [products]);

  useEffect(() => {
    fetch("/api/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const loginRoutes = [
    {
      path: "/login",
      element: <LoginForm setUser={setUser} />,
    },
    {
      path: "/signup",
      element: <SignUpForm />,
    },
    {
      path: "/forgetpassword",
      element: <ForgetPassword />,
    },
  ];

  const productsPageRoutes = [
    {
      path: "/",
      element: (
        <ProductsPage
          products={products}
          category={category}
          sortByCategory={sortByCategory}
          setSortByCategory={setSortByCategory}
        />
      ),
    },
    {
      path: "/products/:productName",
      element: <SelectedProductPage products={products} />,
    },
  ];

  const accessDeniedComponent = (
    <div className="centered-message">Access denied</div>
  );

  const customerPagesRoutes = [
    ...productsPageRoutes,
    {
      path: "/maps",
      element: <Map />,
    },
    {
      path: "/booking",
      element: <AppointmentPage />,
    },
    {
      path: "/history",
      element: <UpcomingAppointment />,
    },
  ];

  const hrAdminRouteConfig = [
    {
      path: "/admin/*",
      element: <Admin />,
    },
    {
      path: "/makeupartist/:id/*",
      element: <MakeupArtist />,
    },
    {
      path: "/makeupartist/edit/:id",
      element: <Edit />,
    },
    {
      path: "/newmakeupartist",
      element: <NewArtist />,
    },
  ];

  const opsAdminRouteConfig = [
    {
      path: "/productpage",
      element: <ProductsForm products={products} delProduct={delProduct} />,
    },
    {
      path: "/productpage/new",
      element: (
        <AddProductsForm
          products={products}
          addProduct={addProduct}
          category={category}
          brand={brand}
        />
      ),
    },
    {
      path: "/productpage/products/:productID/edit",
      element: (
        <EditProductsForm
          products={products}
          category={category}
          brand={brand}
          handleEditProduct={handleEditProduct}
        />
      ),
    },
    {
      path: "/adminlocation",
      element: <InventoryManagement />,
    },
    {
      path: "/adminlocation/edit",
      element: <InventoryAdd />,
    },
  ];

  const loggedInRoleSpecificRoutes = [
    {
      role: "HRADMIN",
      content: (
        <Routes>
          {customerPagesRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={
                <WithCustomerNavTools>{config.element}</WithCustomerNavTools>
              }
            />
          ))}
          {hrAdminRouteConfig.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={<WithNavBar>{config.element}</WithNavBar>}
            />
          ))}
          <Route key="*" path="*" element={accessDeniedComponent} />
        </Routes>
      ),
    },
    {
      role: "OPSADMIN",
      content: (
        <Routes>
          {customerPagesRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={
                <WithCustomerNavTools>{config.element}</WithCustomerNavTools>
              }
            />
          ))}
          {opsAdminRouteConfig.map((config) => {
            return (
              <Route
                key={config.path}
                path={config.path}
                element={<WithNavBar>{config.element}</WithNavBar>}
              />
            );
          })}
          <Route key="*" path="*" element={accessDeniedComponent} />
        </Routes>
      ),
    },
    {
      role: "CUSTOMER",
      content: (
        <Routes>
          {customerPagesRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={
                <WithCustomerNavTools>{config.element}</WithCustomerNavTools>
              }
            />
          ))}
          <Route key="*" path="*" element={accessDeniedComponent} />
        </Routes>
      ),
    },
  ];

  const renderAuthenticatedPages = (cust) => {
    const renderLoggedInContent = loggedInRoleSpecificRoutes.find(
      (config) => config.role === cust.role
    )?.content;

    return <React.Fragment>{renderLoggedInContent}</React.Fragment>;
  };

  const renderUnauthenticatedPages = () => (
    <React.Fragment>
      <WithCustomerNavTools>
        <Routes>
          {loginRoutes.map((config) => (
            <Route {...config} />
          ))}
          <Route path="/maps" element={<Map />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/makeupartist/:id/*" element={<MakeupArtist />} />
          {productsPageRoutes.map((config) => (
            <Route key={config.path} {...config}></Route>
          ))}
          {customerPagesRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={
                <div className="centered-message">
                  <Link to="/login">Please login</Link>
                </div>
              }
            />
          ))}
          {hrAdminRouteConfig.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={accessDeniedComponent}
            />
          ))}
          {opsAdminRouteConfig.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={accessDeniedComponent}
            />
          ))}
        </Routes>
      </WithCustomerNavTools>
    </React.Fragment>
  );
  console.log("customer ", customer?.customer);

  return (
    <main className="App">
      <Header
        setUser={setUser}
        customer={customer ? customer.customer : null}
      />
      {customer
        ? renderAuthenticatedPages(customer.customer)
        : renderUnauthenticatedPages()}
    </main>
  );
}
