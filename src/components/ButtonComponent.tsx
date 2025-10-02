import React from "react";
import style from "../styles/components/ButtonComponent.module.scss";
type ButtonProps = {
  id: string;
  label: string;
};

function ButtonComponent({ id, label }: ButtonProps): React.JSX.Element {
  return (
    <div className={style.buttonContainer}>
      <button className={style.button} id={id}>
        {label}
      </button>
    </div>
  );
}

export default ButtonComponent;
