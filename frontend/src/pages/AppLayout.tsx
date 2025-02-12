import { Outlet } from "react-router-dom";
import classes from "./AppLayout.module.css";

const AppLayout = () => {
  return (
    <div className={classes.appLayout}>
      <div className={classes.appContainer}>
        <Outlet />
      </div>
      <a
        className={classes.link}
        href="https://github.com/migliorelli"
        target="_blank"
      >
        @migliorelli on Github
      </a>
    </div>
  );
};

export default AppLayout;
