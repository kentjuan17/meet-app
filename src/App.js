import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { PhoneReg } from "./pages/PhoneReg";
import { LoginPhone } from "./pages/LoginPhone";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "./context/CurrentUserContext";

function App() {
  const { currentUser } = useContext(CurrentUserContext);

  const NoLoggedInUser = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <NoLoggedInUser>
                <Home />
              </NoLoggedInUser>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="mobile" element={<PhoneReg />} />
          <Route path="mobileLogin" element={<LoginPhone />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
