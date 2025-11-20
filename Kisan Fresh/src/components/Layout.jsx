import React from 'react'
import Navbar from './navbar/Navbar'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'


function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  )
}

export default Layout