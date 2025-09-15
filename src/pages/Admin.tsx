import { useAuth } from "../hooks/AuthHook";
import { Navigate } from "react-router-dom";
function Admin() {
  const { user, isAdmin } = useAuth();
  console.log("ADMIN", user);
  console.log("ADMIN2", isAdmin());
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1>Admin</h1>
    </>
  );
}

export default Admin;

