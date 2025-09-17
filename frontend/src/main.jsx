import { createRoot } from "react-dom/client";
import RootProvider from "./provider/RootProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <RootProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RootProvider>
);
