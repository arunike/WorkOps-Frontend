import React, { useState } from "react";
import {
    Button,
    Box,
    Grid,
    Card,
    TextField,
    Snackbar,
    Alert,
    Typography,
    Link
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { useAuth } from "../../utils/context/AuthContext";
import Logo from "../../components/Logo";
import Page from "../../components/Page";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Register = () => {
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { signup } = useAuth();
    let navigate = useNavigate();

    const validationSchema = Yup.object({
        FirstName: Yup.string().required("First Name is required"),
        LastName: Yup.string().required("Last Name is required"),
        Email: Yup.string().email().required().label("Email"),
        Password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
        ConfirmPassword: Yup.string()
            .oneOf([Yup.ref('Password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleSubmit = async (values) => {
        try {
            await signup(values.Email, values.Password, values.FirstName, values.LastName);
            navigate("/home", { replace: true });
        } catch (error) {
            setErrorMessage(error.message || "Failed to register");
            setAlert(true);
        }
    };

    return (
        <Page title="WorkOps - Register">
            <Grid
                sx={{ p: 1, pb: 5, pt: 6 }}
                container
                direction="column"
                justifyContent="Center"
                alignItems="Center"
            >
                <Snackbar
                    open={alert}
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        variant="filled"
                        severity="error"
                        onClose={() => setAlert(false)}
                        sx={{ width: "100%", mt: 7 }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>

                <Formik
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    initialValues={{
                        FirstName: "",
                        LastName: "",
                        Email: "",
                        Password: "",
                        ConfirmPassword: "",
                    }}
                >
                    {() => (
                        <Form>
                            <Card sx={{ minWidth: 380, p: 3 }}>
                                <Grid
                                    container
                                    direction="column"
                                    justifyItems="center"
                                    justifyContent="center"
                                    alignItems="center"
                                    rowGap={2}
                                >
                                    <Logo sx={{ width: 200, pb: 2 }} />

                                    <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>

                                    <Field
                                        as={TextField}
                                        label="First Name"
                                        name="FirstName"
                                        fullWidth
                                        size="small"
                                    />
                                    <ErrorMessage name="FirstName" render={msg => <Typography variant="caption" color="error">{msg}</Typography>} />

                                    <Field
                                        as={TextField}
                                        label="Last Name"
                                        name="LastName"
                                        fullWidth
                                        size="small"
                                    />
                                    <ErrorMessage name="LastName" render={msg => <Typography variant="caption" color="error">{msg}</Typography>} />

                                    <Field
                                        as={TextField}
                                        label="Email"
                                        type="email"
                                        name="Email"
                                        fullWidth
                                        size="small"
                                    />
                                    <ErrorMessage name="Email" render={msg => <Typography variant="caption" color="error">{msg}</Typography>} />

                                    <Field
                                        as={TextField}
                                        label="Password"
                                        type="password"
                                        name="Password"
                                        size="small"
                                        fullWidth
                                    />
                                    <ErrorMessage name="Password" render={msg => <Typography variant="caption" color="error">{msg}</Typography>} />

                                    <Field
                                        as={TextField}
                                        label="Confirm Password"
                                        type="password"
                                        name="ConfirmPassword"
                                        size="small"
                                        fullWidth
                                    />
                                    <ErrorMessage name="ConfirmPassword" render={msg => <Typography variant="caption" color="error">{msg}</Typography>} />

                                    <Button
                                        sx={{ width: "100%", mt: 2 }}
                                        type="submit"
                                        variant="contained"
                                    >
                                        Register
                                    </Button>

                                    <Link component={RouterLink} to="/login" variant="body2" sx={{ mt: 2 }}>
                                        Already have an account? Login
                                    </Link>

                                </Grid>
                            </Card>
                        </Form>
                    )}
                </Formik>
            </Grid>
        </Page>
    );
};

export default Register;
