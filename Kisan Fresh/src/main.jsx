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
import Add_veggies from "./components/seller/Add_veggies.jsx";
import CustomerProfile from "./components/customer/customerProfile.jsx";
import SellerVegetables from "./components/seller/SellerVegetables.jsx";
import EditVegetable from "./components/seller/Edit_veggies.jsx";
import PrivateRoute from "./components/misc/PrivateRoute.jsx";
import PublicRoute from "./components/misc/PublicRoute.jsx";
import CompletedPurchases from "./components/buyer/CompletedPurchases.jsx";
import PendingPurchases from "./components/buyer/PendingPurchases.jsx";
import BuyerDashboard from "./components/buyer/BuyerDashboard.jsx";
import AddReview from "./components/buyer/AddReview.jsx";
import BuyerAnalytics from "./components/buyer/Dashboard.jsx";
    

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/customer">
          <Route path="register" element={<CustomerRegister />} />
          <Route path="login" element={<CustomerLogin />} />
        </Route>
        <Route path="/seller">
          <Route path="register" element={<SellerRegister />} />
          <Route path="login" element={<SellerLogin />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<App />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/customer">
          <Route path="cart" element={<CartPage />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="completed_purchases" element={<CompletedPurchases />} />
          <Route path="pending_purchases" element={<PendingPurchases />} />
          <Route path="review/:purchaseId/:itemId" element={<AddReview />} />
          <Route path="analysis" element={<BuyerAnalytics />} />
        </Route>

        <Route path="/seller">
          <Route path="profile" element={<SellerProfile />} />
          <Route path="add_veggies" element={<Add_veggies />} />
          <Route path="my_vegetables" element={<SellerVegetables />} />
          <Route path="edit_veggies/:id" element={<EditVegetable />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <div className="text-center py-20 text-red-500 font-semibold">
            404 Page Not Found
          </div>
        }
      />
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
