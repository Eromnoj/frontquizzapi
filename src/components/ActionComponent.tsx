import React from "react";
import style from "../styles/components/ActionComponent.module.scss";
type ActionProps = {
  id: string;
  label: string;
  type: 'action' | 'confirm' | 'alert';
  onClick: (() => void) | (() => Promise<void>)
};

function ActionComponent({ id, label, type, onClick }: ActionProps): React.JSX.Element {
  return (
    <div className={style.buttonContainer}>
      <button className={[style[type],style.button].join(' ')} id={id} onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

export default ActionComponent;
