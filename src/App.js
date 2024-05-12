import "./App.css";
import CustomNavbar from "./features/navbar/CustomNavbar";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ManageUsers from "./pages/ManageUsers";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Protected from "./features/auth/components/Protected";
import CreateTicket from "./features/ticket/components/CreateTicket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllTicketsAsync } from "./features/ticket/getTicketSlice";
import Dashboard from "./pages/Dashboard";
import { getAllProjectsAsync } from "./features/project/projectSlice";
import { getAllUsers } from "./features/auth/authAPI";
import { getUsersAsync } from "./features/auth/usersSlice";
import CreateProject from "./features/project/components/CreateProject";
import AdminProtected from "./features/auth/components/AdminProtected";
import SeniorManagerCheck from "./features/auth/components/SeniorManagerCheck";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <CustomNavbar>
          <Tickets />
        </CustomNavbar>
      </Protected>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <AdminProtected>
          <CustomNavbar>
            <Dashboard />
          </CustomNavbar>
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/Tickets/:id",
    element: (
      <Protected>
        <CustomNavbar>
          <TicketDetail />
        </CustomNavbar>
      </Protected>
    ),
  },
  {
    path: "/Projects",
    element: (
      <Protected>
        <AdminProtected>
          <CustomNavbar>
            <SeniorManagerCheck>
              <Projects />
            </SeniorManagerCheck>
          </CustomNavbar>
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/Project/:id",
    element: (
      <Protected>
        <AdminProtected>
          <SeniorManagerCheck>
            <CustomNavbar>
              <ProjectDetails />
            </CustomNavbar>
          </SeniorManagerCheck>
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/manageusers",
    element: (
      <Protected>
        <AdminProtected>
          <CustomNavbar>
            <ManageUsers />
          </CustomNavbar>
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/createticket",
    element: (
      <Protected>
        <CreateTicket />
      </Protected>
    ),
  },
  {
    path: "/createproject",
    element: (
      <Protected>
        <AdminProtected>
          <SeniorManagerCheck>
            <CreateProject />
          </SeniorManagerCheck>
        </AdminProtected>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/reset",
    element: <ResetPassword />,
  },
]);

function App() {
  return (
    <div className="App bg-gray-600">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
