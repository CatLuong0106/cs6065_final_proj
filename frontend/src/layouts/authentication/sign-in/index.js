/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { Navigate } from 'react-router-dom';

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { doSignInWithEmailOrUsername } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext";

function SignIn() {
  const { userLoggedIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const onSubmit = async(e) => {
    e.preventDefault();
    if (!isSigningIn){
      setIsSigningIn(true)
      await doSignInWithEmailOrUsername(identifier, password)
    }
  }

  return (
    <>
    {userLoggedIn ? (
      <Navigate to="/dashboard" replace={true} />
    ) : (
    <CoverLayout
        title="Welcome back"
        description="Enter your email and password to sign in"
        image={curved9}
      >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput type="text" placeholder="Email or Username" onChange={(e) => setIdentifier(e.target.value)}/>
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Password
              </SoftTypography>
            </SoftBox>
            <SoftInput type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton variant="gradient" color="info" fullWidth onClick={onSubmit}>
              sign in
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="button" color="text" fontWeight="regular">
              Don&apos;t have an account?{" "}
              <SoftTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign up
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CoverLayout>
    )}
    </>
  );
}

export default SignIn;
