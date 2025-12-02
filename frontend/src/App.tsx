import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "jotai";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import Favorites from "./pages/favorite";
import ProtectedRoute from "./components/protectedRoutes";
import PublicRoute from "./components/publicRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
