import classes from "./Switch.module.css";

interface SwitchProps {
  checked: boolean;
  label?: string;
  onChange: () => void;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => {
  return (
    <label className={classes.switchContainer}>
      <input type="checkbox" onChange={onChange} checked={checked} className={classes.checkbox} />
      <div className={classes.switch}>
        <div className={classes.switchDot} />
      </div>
      {label && <span className={classes.label}>{label}</span>}
    </label>
  );
};

export default Switch;
