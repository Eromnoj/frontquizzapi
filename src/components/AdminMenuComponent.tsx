import React, { type Dispatch, type SetStateAction } from 'react';
import style from '../styles/components/AdminMenuComponent.module.scss';
type MenuProps = {
  active: number;
  setActive: Dispatch<SetStateAction<number>>
}
function AdminMenuComponent({ active, setActive }: MenuProps): React.JSX.Element {

  const menu = [
    "Modération",
    "Quizz",
    "Utilisateur"
  ];

  const menuMap = menu.map((entry, index) => {
    return (
      <li key={index} className={(active === index ? style.active : '') + ' ' + style.menuEntry} onClick={() => setActive(index)}>
        <p>
          {entry}
        </p>
      </li>
    )
  })
  return (
    <menu className={style.menuContainer}>
      {menuMap}
    </menu>
  )
}

export default AdminMenuComponent;