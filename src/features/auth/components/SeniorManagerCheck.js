import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser } from "../authSlice";

function SeniorManagerCheck({ children }) {
  const user = useSelector(selectLoggedInUser);

  if (Number(user.classification) < 3) {
    return <Navigate to="/" replace={true}></Navigate>;
  }
  return children;
}

export default SeniorManagerCheck;
