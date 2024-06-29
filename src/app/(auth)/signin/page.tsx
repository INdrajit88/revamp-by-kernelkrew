"use client";

import { useGlobalContext } from "@/components/ContextProvider";
import FlexContainer from "@/components/FlexContainer";
import ShadcnButton from "@/components/ShadcnButton";
import { Input } from "@nextui-org/react";
import { Form, Formik } from "formik";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

type Props = {};

export interface SignInInterface {
  username: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Page = (props: Props) => {
  const { setUser } = useGlobalContext();
  const [initialValues, setInitialValues] = React.useState<SignInInterface>({
    username: "",
    password: "",
  });
  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    actions.setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
  return (
    <FlexContainer variant="column-center">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, isSubmitting, errors, touched }) => {
          return (
            <Form className="w-full max-w-md">
              <FlexContainer variant="column-start" gap="sm" className="mb-8">
                <h3 className="w-full text-left text-2xl font-medium text-zinc-900">
                  Sign In to Kernel Krew
                </h3>
                <p className="w-full text-left text-sm font-medium text-zinc-700">
                  Create an account to continue
                </p>
              </FlexContainer>
              <FlexContainer
                variant="column-start"
                gap="2xl"
                className="rounded-xl bg-zinc-50 p-3"
              >
                <FlexContainer variant="column-start" gap="lg">
                  <Input
                    label="Username"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Enter your username"
                    classNames={{
                      inputWrapper: "shadow-none border-2 rounded-lg",
                    }}
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username && touched.username}
                    color={
                      !!errors.username && touched.username
                        ? "danger"
                        : "default"
                    }
                    errorMessage={errors.username}
                  />
                  <Input
                    type="password"
                    label="Password"
                    name="password"
                    labelPlacement="outside"
                    placeholder="Enter your password"
                    classNames={{
                      inputWrapper: "shadow-none border-2 rounded-lg",
                    }}
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password && touched.password}
                    color={
                      errors.password && touched.password ? "danger" : "default"
                    }
                    errorMessage={errors.password}
                  />
                </FlexContainer>
                <ShadcnButton
                  isLoading={isSubmitting}
                  variant="primary"
                  type="submit"
                >
                  Sign In
                </ShadcnButton>
                <FlexContainer variant="row-center" gap="md">
                  <p className="text-sm">Don&apos;t have an account?</p>
                  <Link className="text-sm font-medium" href="/signup">
                    Sign Up
                  </Link>
                </FlexContainer>
              </FlexContainer>
            </Form>
          );
        }}
      </Formik>
    </FlexContainer>
  );
};

export default Page;
