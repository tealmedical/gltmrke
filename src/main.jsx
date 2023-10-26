import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Atlas, { loader as atlasLoader } from './routes/atlas'
import Help from './routes/help';
import Layout from './routes/layout';
import NotFound from './routes/not_found';
import Store, { loader as storeLoader } from './routes/store'

import './globals.css'

// see https://reactrouter.com/en/main/routers/create-browser-router
const router = createBrowserRouter([
  {
    path: "*", Component: Layout, children: [
      { index: true, Component: Atlas, loader: atlasLoader },
      { path: "hjælp!", Component: Help },
      { path: ":name/:id", Component: Store, loader: storeLoader },
      { path: "*", Component: NotFound },
    ],
  }
]);

// see https://react.dev/reference/react-dom/client/createRoot
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
