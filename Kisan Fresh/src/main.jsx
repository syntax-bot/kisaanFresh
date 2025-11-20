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
import CustomerRegister from "./components/Auth/customer/register.jsx";
import CustomerLogin from "./components/Auth/customer/login.jsx";
import SellerRegister from "./components/Auth/seller/register.jsx";
import SellerLogin from "./components/Auth/seller/login.jsx";
import SellerProfile from "./components/seller/sellerProfile.jsx";
import Landing from "./components/Landing/Landing.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Landing/>} />
      <Route path="/home" element={<App />} />
      <Route path="/item/:id" element={<ItemPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/customer/register" element={<CustomerRegister/>} />
      <Route path="/customer/login" element={<CustomerLogin/>} />
      <Route path="/seller/register" element={<SellerRegister/>} />
      <Route path="/seller/login" element={<SellerLogin/>} />
      <Route path="/sellerprofile" element={<SellerProfile/>}/>
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
