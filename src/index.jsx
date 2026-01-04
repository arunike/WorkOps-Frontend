import ReactDOM from "react-dom";
import "simplebar/src/simplebar.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/context/AuthContext";

ReactDOM.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>,
  document.getElementById("root")
);
