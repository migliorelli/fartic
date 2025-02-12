import { CSSProperties } from "react";
import classes from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  borderSize?: number;
  size?: number;
}

const LoadingSpinner = ({ borderSize = 3, size = 22 }: LoadingSpinnerProps) => {
  return (
    <div
      style={
        {
          "--borderSize": `${borderSize}px`,
          "--size": `${size}px`,
        } as CSSProperties
      }
      className={classes.loadingSpinner}
    ></div>
  );
};

export default LoadingSpinner;
