import { useContext } from "react";
import "./App.css";

import { LoginContext } from "./components/contexts/AuthProvider";
import LoginPage from "./components/auth/LoginPage";
import Main from "./components/home/main/Main";

function App() {
  const { auth } = useContext(LoginContext);
  return (
    <>
       {auth ? <Main /> : <LoginPage /> } 
    </>
  );
}

export default App;
