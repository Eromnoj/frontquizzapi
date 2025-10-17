import { useAuth } from "../hooks/AuthHook";
import { Navigate } from "react-router-dom";
import PendingComponent from "../components/PendingComponent";
import ActiveComponent from "../components/ActiveComponent";
import ReportedComponent from "../components/ReportedComponent";
import CategoryComponent from "../components/CategoryComponent";
import AdminMenuComponent from "../components/AdminMenuComponent";
import UserComponent from "../components/UserComponent";
import style from "../styles/Admin.module.scss";
import { useState } from "react";
function Admin() {
  const { user, isAdmin } = useAuth();
  console.log("ADMIN", user);
  console.log("ADMIN2", isAdmin());
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const [active, setActive] = useState<number>(0)

  const content = active == 0 ?
    <section className={style.content}>
      <PendingComponent />
      <ReportedComponent />
    </section>
    : active == 1 ?
      <section className={style.content}>
        <ActiveComponent />
        <CategoryComponent />
      </section>
      : active == 2 ?
        <section className={style.content}>
          <UserComponent />
        </section> :
        <>
        </>
  return (
    <section className={style.mainSection}>
    <AdminMenuComponent active={active} setActive={setActive} />
    {content}
    </section>
  );
}

export default Admin;
