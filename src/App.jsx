import "./App.css";
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import Router from "./routes";
import {
  associatesContext,
  officesContext,
  updateAssociatesContext,
  loadingContext,
  departmentsContext,
  resultsPerPageContext,
  tasksToApproveContext,
  notificationsContext,
} from "./utils/context/contexts";
import React, { useEffect, useState, useContext } from "react";
import { AuthProvider, useAuth } from "./utils/context/AuthContext";
import { api } from "./utils/api";

function App() {
  const [updateAssociates, setUpdateAssociates] = useState(1);
  const [associates, setAssociates] = useState([]);
  const [allOffices, setOffices] = useState([]);
  const [allDepartments, setDepartments] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toApproveCount, setToApproveCount] = useState();
  const [tasks, setTasks] = useState({});
  const [tasksToApprove, setTaskstoApprove] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Use AuthContext
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState();
  // We can derive isAdmin from userData or context directly, but keeping local state if logic differs slightly
  // Assuming context handles isAdmin, but let's keep logic close to original for now or rely on context.
  // Original code derived isAdmin from userData matched from associates.

  useEffect(() => {
    if (currentUser) {
      // If currentUser from context is already the full object, we might not need to search associates again.
      // However, the original code looked up the user in `associates` list to get details.
      // Let's rely on currentUser being sufficient or update it when associates are loaded.
      setUserData(currentUser);
    }
  }, [currentUser]);


  document.title = "WorkOps";
  const getAssociates = async () => {
    try {
      const data = await api("/associates");
      const transformed = (Array.isArray(data) ? data : []).map((user) => ({
        ...user,
        id: user.id || user.ID,
        StartDate: { toDate: () => new Date(user.StartDate) },
        DOB: { toDate: () => new Date(user.DOB) },
      }));
      setAssociates(transformed);

      // Original logic to find current user in associates list if we have an email
      if (currentUser && currentUser.Email) {
        // Note: Context might have 'Email' (cap) or 'email'. Check AuthContext.
        // AuthContext uses payload with 'Email'.
        const email = currentUser.Email || currentUser.email;
        const userDetail = transformed.find(a => a.WorkEmail === email || a.PrivateEmail === email);
        if (userDetail) {
          setUserData(userDetail);
          // setIsAdmin(userDetail.Title === "Admin"); // isAdmin is not used in JSX here but might be needed elsewhere?
        } else {
          // Fallback if not found in associates list but logged in (e.g. admin)
          setUserData(currentUser);
        }
      }

    } catch (error) {
      console.error("Failed to fetch associates:", error);
      setAssociates([]);
    }
  };
  const getOffices = async () => {
    try {
      const data = await api("/offices");
      setOffices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch offices:", error);
      setOffices([]);
    }
  };
  const getDepartments = async () => {
    try {
      const data = await api("/departments");
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([]);
    }
  };

  const getTasks = async () => {
    try {
      if (!userData || !userData.id) return; // Ensure userData is available

      const data = await api("/tasks");

      const myTasks = {};
      const toApprove = {};

      (Array.isArray(data) ? data : []).forEach((task, index) => {
        // Add to main tasks list if user is requester OR approver
        // This allows "Complete" column to show tasks I approved/rejected
        if (task.requester === userData.id || (task.approvers && task.approvers[userData.id])) {
          myTasks[task.id] = task;
        }

        // Only add to "To Approve" list if:
        // 1. Task is mapped to this user (approver)
        // 2. The task itself is globally PENDING
        // 3. The user specifically has a "pending" status
        // 4. Sequential check: All approvers with lower 'order' must be 'approved'
        if (
          task.approvers &&
          task.approvers[userData.id] &&
          task.status === "pending" &&
          task.approvers[userData.id].status === "pending"
        ) {
          const myOrder = task.approvers[userData.id].order || 0;
          let isTurn = true;

          // Check strict sequence if orders exist
          if (myOrder > 0) {
            Object.keys(task.approvers).forEach(otherId => {
              const otherApprover = task.approvers[otherId];
              const otherOrder = otherApprover.order || 0;

              // If someone comes before me (lower order) AND they haven't approved yet, I can't act.
              if (otherOrder > 0 && otherOrder < myOrder && otherApprover.status !== 'approved') {
                isTurn = false;
              }
            });
          }

          if (isTurn) {
            toApprove[task.id] = task;
          }
        }
      });

      setTasks(myTasks);
      setTaskstoApprove(toApprove);

    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    getAssociates();
    getDepartments();
    getOffices();
  }, [currentUser]); // Re-run associates fetch if user changes to match logic

  useEffect(() => {
    if (userData) {
      getTasks();
    }
  }, [userData]);

  useEffect(() => {
    {
      tasksToApprove && setToApproveCount(Object.keys(tasksToApprove).length);
    }
  }, [tasksToApprove]);
  return (
    <>
      <tasksToApproveContext.Provider
        value={{ toApproveCount, setToApproveCount, tasks, tasksToApprove }}
      >
        <notificationsContext.Provider value={{ notifications, setNotifications }}>
          <resultsPerPageContext.Provider
            value={{ rowsPerPage, setRowsPerPage }}
          >
            <associatesContext.Provider value={{ associates, setAssociates }}>
              <updateAssociatesContext.Provider
                value={{ updateAssociates, setUpdateAssociates }}
              >
                <loadingContext.Provider
                  value={{ loadingProgress, setLoadingProgress }}
                >
                  <officesContext.Provider value={{ allOffices, setOffices }}>
                    <departmentsContext.Provider
                      value={{ allDepartments, setDepartments }}
                    >
                      <ThemeConfig>
                        <GlobalStyles />
                        <Router />
                      </ThemeConfig>
                    </departmentsContext.Provider>
                  </officesContext.Provider>
                </loadingContext.Provider>
              </updateAssociatesContext.Provider>
            </associatesContext.Provider>
          </resultsPerPageContext.Provider>
        </notificationsContext.Provider>
      </tasksToApproveContext.Provider>
      {/* </AuthContext.Provider> */}
    </>
  );
}

export default App;
