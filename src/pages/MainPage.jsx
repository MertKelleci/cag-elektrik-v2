import { useContext } from "react";
import Login from "./Login/Login.jsx";
import Logout from "./Logout/Logout.jsx";
import { LoginContext } from "../LoginContext.jsx";

const MainPage = () => {
  const { currentUser } = useContext(LoginContext);
  if (!currentUser) {
    return <Login />;
  } else {
    return <Logout />;
  }
};

export default MainPage;
