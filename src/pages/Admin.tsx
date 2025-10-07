import { useAuth } from "../hooks/AuthHook";
import { Navigate } from "react-router-dom";
import PendingComponent from "../components/PendingComponent";
import ActiveComponent from "../components/ActiveComponent";
import ReportedComponent from "../components/ReportedComponent";
function Admin() {
  const { user, isAdmin } = useAuth();
  console.log("ADMIN", user);
  console.log("ADMIN2", isAdmin());
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PendingComponent />
      <ReportedComponent />
      <ActiveComponent />
    </>
  );
}

export default Admin;
