import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectLoggedInUser } from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { checkUserAsync } from "../authSlice";
import { useForm } from "react-hook-form";

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function handleGuest() {
    console.log("guest");
    dispatch(
      checkUserAsync({ email: "bugadmin@gmail.com", password: "Qwerty12" })
    );
  }

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm min-w-full flex flex-col items-center justify-center">
          <div class="h-24 w-24 rounded-full overflow-hidden  bg-gray-200">
            <img
              src="/Logo1.png"
              alt="Your Image"
              class="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="mt-10 text-center text-3xl font-semibold leading-9 tracking-tight text-orange-500">
              Welcome to Bug Tracker
            </h2>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              dispatch(
                checkUserAsync({ email: data.email, password: data.password })
              );
            })}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-300"
                >
                  Username
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "email not valid",
                    },
                  })}
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-300"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link to={"/reset"}>
                    <a
                      href="#"
                      className="font-semibold text-orange-400 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "password is required",
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-red-500">{error.message}</p>}
            </div>

            <div className="flex flex-row gap-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>
          <div className="pt-2">
            <button
              onClick={(e) => handleGuest(e)}
              className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in as Guest Admin
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-white">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-orange-400 hover:text-indigo-500"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
