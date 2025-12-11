import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SeriesPage from "./pages/SeriesPage/SeriesPage";
import MyList from "./pages/MyList/MyList";
import ListDetail from "./pages/ListDetail/ListDetail";
import SearchPage from "./pages/SearchPage/SearchPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import DetailsPage from "./pages/DetailsPage/DetailsPage";
import Topbar from "./components/Topbar/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const noMarginRoutes = ["/Login", "/MyList"];
  const marginTop = noMarginRoutes.includes(location.pathname) ? "0" : "55px";

  return (
    <>
      <Topbar />
      <main style={{ marginTop }}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas */}
          <Route
            path="/SeriesPage"
            element={
              <ProtectedRoute>
                <SeriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylist"
            element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list/:id"
            element={
              <ProtectedRoute>
                <ListDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/details/:id"
            element={
              <ProtectedRoute>
                <DetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;