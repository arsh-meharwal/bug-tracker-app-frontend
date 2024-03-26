import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser } from "../authSlice";

function AdminProtected({ children }) {
  const user = useSelector(selectLoggedInUser);

  if (Number(user.classification) < 2) {
    return <Navigate to="/" replace={true}></Navigate>;
  }
  return children;
}

export default AdminProtected;
