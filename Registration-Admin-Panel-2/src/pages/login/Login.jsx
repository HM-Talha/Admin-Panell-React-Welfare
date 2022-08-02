import { useContext, useState } from "react";
import "./login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Toast from "../../components/toast/Toast";
import { toast } from "react-toastify";

const Login = ({ setAdminUi, adminUi }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navitage = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("userEMAIL", JSON.stringify(email));
        localStorage.setItem("userPASSWORD", JSON.stringify(password));

        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        toast.success("Login Successfully");
        setTimeout(() => {
          navitage("/", {replace: true});
        }, 3000);

        if (user.email == "admin@matrixtech.com") {
          setAdminUi(true);
        }
      })
      .catch((error) => {
        toast.error("Invalid Credentials");
      });
  };

  return (
    <div className="login">
      <Toast />
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
