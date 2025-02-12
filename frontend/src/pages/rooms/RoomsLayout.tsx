import { Outlet } from "react-router-dom";
import classes from "./RoomsLayout.module.css";

const RoomsLayout = () => {
  return (
    <div className={classes.roomsLayout}>
      <Outlet />
    </div>
  );
};

export default RoomsLayout;
