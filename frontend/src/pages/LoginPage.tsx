import LoginForm from "@/components/login-form/LoginForm";
import { useUsername } from "@/contexts/UsernameContext";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import classes from "./LoginPage.module.css";

const LoginPage = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const { username, login } = useUsername();

  if (username !== null) {
    return <Navigate to="/rooms" />;
  }

  const handleSubmit = () => {
    if (usernameValue.trim().length > 0) {
      login(usernameValue);
    }
  };

  return (
    <div>
      <div className={`container ${classes.loginContainer}`}>
        <h1>
          <span className="text-mark">fart</span>.ic
        </h1>
        <h3 className={classes.title}>Enter a username</h3>
        <LoginForm
          username={usernameValue}
          onChange={(value) => setUsernameValue(value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LoginPage;
