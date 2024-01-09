import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const basename = process.env.PUBLIC_URL;

// Allows usage of React-Query library
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log(`Error: ${error.message}`);
      }
    },
  }),
});

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <App />
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
