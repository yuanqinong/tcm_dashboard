import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login, signup } from "../../Redux/actions/LoginAction";
import Alert from '../AlertComponent/alert';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, severity) => {
    setAlert({ message, severity});
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const authFunction = isLogin ? login : signup;
        const response = await authFunction(formData);
        console.log(response);
        if(isLogin && response.status === 401){
          showAlert("Invalid username or password", "error");
        }
        else if(!isLogin && response.status === 400){
          showAlert("Username already exists", "error");
        }
        if(isLogin && response.status === 200){
          const { access_token } = response.data;
          localStorage.setItem("token", access_token);
          navigate("/content-manager");
        }
      } catch (error) {
        console.error(`${isLogin ? "Login" : "Signup"} failed:`, error);
        showAlert("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardHeader
          title={isLogin ? "Login" : "Sign Up"}
          subheader={
            isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to get started"
          }
        />
        <CardContent>
          <form onSubmit={handleAuth}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!isLogin && (
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              )}
              <Button type="submit" variant="contained" fullWidth>
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </Box>
          </form>
        </CardContent>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              onClick={() => setIsLogin(!isLogin)}
              sx={{ p: 0, minWidth: 0 }}
            >
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </Typography>
        </Box>
      </Card>
      {alert && (
        <div className="alert-container">
          <Alert
            message={alert.message}
            severity={alert.severity}
            duration={3000}
            onClose={closeAlert}
          />
        </div>
      )}
    </Box>
  );
}
