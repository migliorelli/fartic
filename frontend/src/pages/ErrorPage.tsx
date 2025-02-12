import { useNavigate, useRouteError } from "react-router-dom";
import classes from "./ErrorPage.module.css";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/rooms");
  };

  return (
    <div className={classes.errorPageRoot}>
      <div className={`container ${classes.errorContainer}`}>
        <h1>Error</h1>
        <p>{error?.message}</p>
        <button className="btn btn-outline" onClick={goBack}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
