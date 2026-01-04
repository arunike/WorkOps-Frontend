import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    async function signup(email, password, firstName, lastName) {
        const payload = {
            Email: email,
            Password: password,
            FirstName: firstName,
            LastName: lastName
        };

        const response = await fetch("http://localhost:8081/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Registration failed");
        }

        const user = await response.json();
        // Backend returns raw user, ensure StartDate helper if needed or handle parsing in components
        if (user.StartDate) {
            user.StartDate = { toDate: () => new Date(user.StartDate) };
        }

        const adminStatus = email.toLowerCase().includes("admin") || email === "richiezhouyjz@gmail.com";

        setCurrentUser(user);
        setIsAdmin(adminStatus);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAdmin", JSON.stringify(adminStatus));
        return user;
    }

    async function login(email, password) {
        const payload = {
            Email: email,
            Password: password
        };

        const response = await fetch("http://localhost:8081/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }

        const user = await response.json();

        // Mock StartDate helper for compatibility if backend returns string
        if (user.StartDate) {
            user.StartDate = { toDate: () => new Date(user.StartDate) };
        }

        // Admin logic: CEO or HR (People department) or Executive
        const adminStatus =
            (user.Title && user.Title.toLowerCase() === "ceo") ||
            (user.Department && user.Department.toLowerCase() === "people") ||
            (user.Department && user.Department.toLowerCase() === "executive") ||
            email.toLowerCase().includes("admin")

        setCurrentUser(user);
        setIsAdmin(adminStatus);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAdmin", JSON.stringify(adminStatus));
        return user;
    }

    function logout() {
        setCurrentUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        return Promise.resolve();
    }

    function resetUserPassword(email) {
        console.log("Reset password", email);
        return Promise.resolve();
    }

    function updateUserEmail(email) {
        console.log("Update email", email);
        return Promise.resolve();
    }

    function updateUserPassword(password) {
        console.log("Update password", password);
        return Promise.resolve();
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedIsAdmin = localStorage.getItem("isAdmin");

        if (storedUser) {
            // Need to reconstruct methods like toDate if they were lost in JSON serialization
            const parsedUser = JSON.parse(storedUser);
            // Re-hydrate StartDate helper for demo consistency if needed or handle safely in components
            if (parsedUser.StartDate && !parsedUser.StartDate.toDate) {
                parsedUser.StartDate = { toDate: () => new Date(2022, 1, 15) };
            }
            setCurrentUser(parsedUser);
        }
        if (storedIsAdmin) {
            setIsAdmin(JSON.parse(storedIsAdmin));
        }
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        userData: currentUser,
        isAdmin,
        login,
        signup,
        logout,
        resetUserPassword,
        updateUserEmail,
        updateUserPassword,
        setCurrentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
