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

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";


import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext";
import { Navigate } from 'react-router-dom';
import { colRef } from "../../../firebase/firebase";
import { addDoc } from 'firebase/firestore'

function SignUp() {


  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const addUser = async () => {
    try {
      addDoc(colRef, {
        username: username,
        email: email
      })
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    if (!isRegistering){
      setIsRegistering(true)
      await doCreateUserWithEmailAndPassword(email, password)
      addUser()
    }
  }


  const [agreement, setAgremment] = useState(true);

  const handleSetAgremment = () => setAgremment(!agreement);

  return (
    <> {userLoggedIn ? (
      <Navigate to="/authentication/sign-in" replace={true} />
    ) : (

        <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftInput placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={onSubmit}>
                sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
    )}
    </>

  );
}

export default SignUp;
