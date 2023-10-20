import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from './layout';
import Map from './map'
import Store from './store'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Map />,
  },
  {
    path: "/stores/:id",
    element: <Store />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>,
)
