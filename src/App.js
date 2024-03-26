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

const item = {
  "Ticket Number": "23323",
  description: "This is an Item Description.",
  "assigned to": "ashok",
  "assigned toe": "ed",
  "assigned tof": "gg",
};
const tts = {
  title: ["item1", "item2"],
  submitter: ["ashok", "hep"],
  date: ["10th", "23"],
};

export const data = {
  users: [
    {
      name: "Ashok Kumar",
      email: "ak@gmail.com",
      password: "Jatz",
      role: "Admin",
      project: "Ebix",
    },
    {
      name: "Vinesh Kumar",
      email: "vk@gmail.com",
      password: "Jatz",
      role: "Admin",
      project: "Ebix",
    },
    {
      name: "Jitesh Kumar",
      email: "ak@gmail.com",
      password: "Jatz",
      role: "Admin",
      project: "Ebix",
    },
    {
      name: "Mukesh Kumar",
      email: "ak@gmail.com",
      password: "Jatz",
      role: "Admin",
      project: "Ebix",
    },
  ],
  projects: [
    {
      id: "1",
      project: "Ebix",
      "project description": "This project concerns about ebix payment gateway",
      team: [
        { name: "ashok", mail: "ashok@gmail.com", role: "member" },
        { name: "vinesh", mail: "vinesh@gmail.com", role: "admin" },
      ],
      "project tickets": ["227091", "2443728"],
    },
  ],
  tickets: [
    {
      id: "1",
      "Ticket Number": "227091",
      initiator: "ashok",
      "initiator mail": "ashok@gmail.com",
      project: "ebix",
      "project description": "This ",
      user_role: "admin",
      title: "I can't log in to my account!",
      description:
        "When I try to login, it just says 'Invalid username or password.' What do I do?",
      status: "open",
      category: "Account Issues",
      priority: "low",
      created_at: "2016-05-31 14:38:00 -0400",
      updated_at: "2016-05-31 14:38:00 -0400",
      assigned_to: "",
      Comments: [
        {
          by: "ashok",
          date: "14/Dec/2020 18:01:04",
          text: "Hi there,Thank you for reaching out.We will look into this issue as soon as possible.",
          attachments: null,
        },
        {
          by: "ashok",
          date: "14",
          text: "Hi there,Thank you for reaching out.We will look into this issue as soon as possible.",
          attachments: null,
        },
      ],
    },
    {
      id: "2",
      "Ticket Number": "227022",
      initatior: "ashok",
      "initiator mail": "ashok@gmail.com",
      project: "ebix",
      user_role: "admin",
      title: "I can't log in to my account!",
      description:
        "When I try to login, it just says 'Invalid username or password.' What do I do?",
      status: "open",
      category: "Account Issues",
      priority: "low",
      created_at: "2016-05-31 14:38:00 -0400",
      updated_at: "2016-05-31 14:38:00 -0400",
      assigned_to: "",
      Comments: {
        "comment by": ["ashok", "vivek"],
        "comment date": [
          "2016-05-31 14:38:00 -0400",
          "2023-05-31 14:38:00 -0400",
        ],
        body: ["Please check your email and password.", "yes on it"],
      },
      attachments: [],
    },
  ],
};
// let allTickets = async () => {
//   let tickets = await fetch("http://localhost:8081/tickets");
//   let data = await tickets.json();
//   return data;
// };

// export const ticketData = await allTickets();

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
]);

function App() {
  // ToDo enforce this dispatch when backend is setup otherwise error

  // let dispacth = useDispatch();
  // const page = 1;
  // useEffect(() => {
  //   const paginate = { _page: page, _limit: 7 };
  //   // dispacth(getAllTicketsAsync(paginate));
  //   dispacth(getAllProjectsAsync(paginate));
  //   dispacth(getUsersAsync());
  // }, []);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
