import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Homepage from './Homepage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/", //Akses melalui base_url
    element: <Homepage/>,
  },
  {
    path: "/player", //Akses melalui base_url/about
    element: <App/>,
  },
  {
    path: "/bot", //Akses melalui base_url/about
    element: <App/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
