import AssociateHeader from "../../components/Associate/associateHeader";
import { useEffect, useState, React, useContext } from "react";
import { useParams } from "react-router-dom";
import { transform, isEqual, isObject } from "lodash";
import { Grid, Snackbar, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  associateContext,
  loadingContext,
  updatedAssociateContext,
  updateAssociatesContext,
} from "../../utils/context/contexts";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/context/AuthContext";
import Page from "../../components/Page";
const AssociateDetails = () => {
  const { userData, isDemo, setCurrentUser } = useAuth();
  const history = useNavigate();

  const { setLoadingProgress } = useContext(loadingContext);
  const { id } = useParams();
  const [associateData, setAssociateData] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [severity, setSeverity] = useState();
  const [updatedAssociate, setUpdatedAssociate] = useState();
  const { setUpdateAssociates } = useContext(updateAssociatesContext);

  useEffect(() => {
    const getAssociate = async () => {
      const associateFromServer = await fetchDetails();
      setAssociateData({ ...associateFromServer, id: id });
      setUpdatedAssociate({ ...associateFromServer, id: id });
    };
    getAssociate();
  }, [id]);

  const fetchDetails = async () => {
    setLoadingProgress(true);
    try {
      const data = await api(`/associates/${id}`) || {};
      if (data.StartDate) {
        const d = new Date(data.StartDate);
        data.StartDate = { toDate: () => d };
      }
      if (data.DOB) {
        const d = new Date(data.DOB);
        data.DOB = { toDate: () => d };
      }
      setLoadingProgress(false);
      return data;
    } catch (e) {
      console.error("FETCH DETAILS FAILED:", e);
    }
    setLoadingProgress(false);
    return {};
  };

  const GetDifferences = (object, base) => {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? GetDifferences(value, base[key])
            : value;
      }
    });
  };

  const RecordChanges = async (Data) => {
    for (const [key, value] of Object.entries(Data)) {
      const changesObject = {
        ChangedBy: userData.FirstName + " " + userData.LastName,
        Timestamp: new Date(),
        Category: key,
        Value: value,
        AssociateID: updatedAssociate.id,
      };
    }
  };

  const updateBackendAndState = async () => {
    const Differences = GetDifferences(updatedAssociate, associateData);
    if (Differences) {
      if ("Salary" in Differences) {
        const picked = (({ Salary }) => ({ Salary }))(Differences);
        RecordChanges(picked);
      }
      if ("Title" in Differences) {
        const picked = (({ Title }) => ({ Title }))(Differences);
        RecordChanges(picked);
      }
      if ("Department" in Differences) {
        const picked = (({ Department }) => ({ Department }))(Differences);
        RecordChanges(picked);
      }
    }

    try {
      const payload = { ...updatedAssociate };
      // Ensure dates are strings for backend
      if (payload.StartDate && payload.StartDate.toDate) {
        payload.StartDate = payload.StartDate.toDate();
      }
      if (payload.DOB && payload.DOB.toDate) {
        payload.DOB = payload.DOB.toDate();
      }
      if (payload.Salary) {
        payload.Salary = parseInt(payload.Salary, 10);
      }

      await api(`/associates/${associateData.id}`, {
        method: 'PUT',
        headers: {
          'X-User-ID': userData?.id?.toString() || ''
        },
        body: payload
      });

      setUpdateAssociates((updateAssociates) => updateAssociates + 1);
      setAssociateData(updatedAssociate);

      if (userData && userData.id === updatedAssociate.id) {
        const updatedUser = { ...userData, ...updatedAssociate };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      setSeverity("success");
      setAlertMessage("Successfully updated!");
      setAlert(true);

    } catch (error) {
      setAlertMessage(error.message);
      setSeverity("error");
      setAlert(true);
    }
  };

  const handleBack = () => {
    history("/associates");
  };
  const autoCloseSnack = () => {
    setAlert(false);
  };

  return (
    <>
      <updatedAssociateContext.Provider
        value={{
          updatedAssociate,
          setUpdatedAssociate,
        }}
      >
        <associateContext.Provider value={{ associateData, setAssociateData }}>
          <Page title="WorkOps - Associate details">
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Grid item>
                <Snackbar
                  open={alert}
                  autoHideDuration={4000}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  onClose={() => autoCloseSnack()}
                >
                  <Alert
                    variant="filled"
                    severity={`${severity}`}
                    sx={{ width: "100%", mt: 7 }}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
              </Grid>
            </Grid>
          </Page>
          {associateData && (
            <AssociateHeader
              key={associateData.id}
              handleBack={handleBack}
              updateBackendAndState={updateBackendAndState}
            />
          )}
        </associateContext.Provider>
      </updatedAssociateContext.Provider>
    </>
  );
};

export default AssociateDetails;
