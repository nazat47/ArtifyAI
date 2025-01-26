"use client";
import React, { useState } from "react";
import LoginForm from "./login-form";
import { Button } from "../ui/button";
import SignupForm from "./signup-form";
import ResetForm from "./reset-form";
import Link from "next/link";

const AuthForm = ({ state }: { state: string }) => {
  const [mode, setMode] = useState(state);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to login to your account"
            : "Enter your information below to create an account"}
        </p>
      </div>
      {mode === "login" && (
        <>
          <LoginForm />
          <div className="text-center flex justify-between">
            <Button
              className="p-0"
              onClick={() => setMode("signup")}
              variant={"link"}
            >
              Need an account? Sign up
            </Button>
            <Button
              className="p-0"
              onClick={() => setMode("reset")}
              variant={"link"}
            >
              Forgot Password
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <SignupForm />{" "}
          <div className="text-center">
            <Button
              className="p-0"
              onClick={() => setMode("login")}
              variant={"link"}
            >
              Already have an account? Log in
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking sign up, you agree to our{" "}
            <Link
              href={"#"}
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Services
            </Link>{" "}
            and{" "}
            <Link
              href={"#"}
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </>
      )}
      {mode === "reset" && (
        <>
          <ResetForm />{" "}
          <Button
            className="p-0"
            onClick={() => setMode("login")}
            variant={"link"}
          >
            Back to login
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthForm;
