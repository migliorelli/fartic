import { FormEvent } from "react";
import classes from "./LoginForm.module.css";

interface LoginFormProps {
  username: string;

  onChange: (value: string) => void;
  onSubmit: () => void;
}

const LoginForm = ({ username, onSubmit, onChange }: LoginFormProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={classes.loginForm}>
      <div className="controller">
        <div style={{ display: "flex" }}>
          <label className="label" htmlFor="username">
            Username
          </label>
          <span className="input-tip">{15 - username.length}</span>
        </div>
        <input
          id="username"
          className="input"
          placeholder="Username"
          maxLength={15}
          onChange={(e) => onChange(e.target.value)}
          value={username}
        />
      </div>
      <button className="btn" type="submit">
        PLAY
      </button>
    </form>
  );
};

export default LoginForm;
