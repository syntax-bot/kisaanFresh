import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import App from "./App.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ItemPage from "./components/itempage/ItemPage.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.js";
import CartPage from "./components/cart/Cart.jsx";
import RegistrationPage from "./components/Auth/register.jsx";
import LoginPage from "./components/Auth/login.jsx";
import Add_veggies from "./components/Seller/Add_veggies.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<App />} />
      <Route path="/item/:id" element={<ItemPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<Add_veggies />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
