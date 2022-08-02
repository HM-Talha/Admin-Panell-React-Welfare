import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import AddPost from "./pages/AddPost/AddPost";

function App() {
  const [adminUi, setAdminUi] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  useEffect(() => {
    const data = localStorage.getItem("adminBool");
    setAdminUi(data);
  }, []);
  useEffect(() => {
    if (adminUi) {
      localStorage.setItem("adminBool", JSON.stringify(adminUi));
    }
  }, [adminUi]);

  // console.log(adminUi)
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              path="login"
              element={<Login adminUi={adminUi} setAdminUi={setAdminUi} />}
            />
            <Route
              index
              element={
                <RequireAuth redirectTo="/login">
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List adminUi={adminUi} setAdminUi={setAdminUi} />
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="add-post">
              <Route
                index
                element={
                  <RequireAuth>
                    <AddPost adminUi={adminUi} setAdminUi={setAdminUi} />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={productInputs} title="Add New Product" />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
