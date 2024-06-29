"use client";

import FlexContainer from "@/components/FlexContainer";
import ShadcnButton from "@/components/ShadcnButton";
import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

type Props = {};

export interface SignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  username: string;
  isServiceProvider: boolean;
  address: string;
  services: string[];
  yearsOfExperience?: number;
  feesPerHour?: number;
  landmark?: string;
  city?: string;
  state?: string;
  country_code?: string;
  zip_code?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

const SERVICES = [
  {
    key: "plumber",
    label: "Plumber",
  },
  {
    key: "electrician",
    label: "Electrician",
  },
  {
    key: "carpenter",
    label: "Carpenter",
  },
  {
    key: "cleaner",
    label: "Cleaner",
  },
  {
    key: "others",
    label: "Others",
  },
];

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string()
    .min(10, "Invalid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Too short")
    .max(20, "Too long")
    .matches(
      //atleast one uppercase,atleast one lowercase, one number
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter and one number",
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  username: Yup.string().required("Username is required"),
});

const Page = (props: Props) => {
  const [activePage, setActivePage] = React.useState<number>(0);
  const [fetchingLocation, setFetchingLocation] =
    React.useState<boolean>(false);
  console.log(activePage, "activePage");
  const [initialValues, setInitialValues] = React.useState<SignUpFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    username: "",
    isServiceProvider: false,
    address: "",
    services: [],
    yearsOfExperience: 0,
    feesPerHour: 0,
    landmark: "",
    city: "",
    state: "",
    country_code: "",
    zip_code: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
  });
  const router = useRouter();
  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (values.isServiceProvider && activePage === 0) {
      setActivePage(1);
      return;
    }
    const services = values.services
      .toString()
      .split(",")
      .map((item) => item.trim());
    console.log(values);
    console.log(services);

    // return;
    actions.setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone_number: values.phone_number,
          password: values.password,
          confirm_password: values.confirm_password,
          username: values.username,
          isServiceProvider: values.isServiceProvider,
          address: values.address,
          services,
          yearsOfExperience: values.yearsOfExperience,
          feesPerHour: values.feesPerHour,
          landmark: values.landmark,
          city: values.city,
          state: values.state,
          country_code: values.country_code,
          zip_code: values.zip_code,
          timezone: values.timezone,
          latitude: values.latitude,
          longitude: values.longitude,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        router.push("/signin");
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

  const fetchLocationData = async (
    address: string,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setFetchingLocation(true);
    try {
      const apiKey = "AIzaSyARvglBnKE3rvok7RdoGs6-1v7UEhxg4KU"; // Replace with your Google Maps API key
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: apiKey,
          },
        },
      );

      if (geocodeResponse.data.status === "OK") {
        const result = geocodeResponse.data.results[0];
        const { address_components, geometry, formatted_address } = result;
        const location = geometry.location;

        const address = formatted_address;
        const landmark = address_components.find(
          (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes("locality"),
        )?.long_name;
        const city = address_components.find(
          (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes("administrative_area_level_3"),
        )?.long_name;
        const state = address_components.find(
          (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes("administrative_area_level_1"),
        )?.long_name;
        const country = address_components.find(
          (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes("country"),
        )?.short_name;
        const postalCode = address_components.find(
          (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes("postal_code"),
        )?.long_name;

        const timezoneResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/timezone/json`,
          {
            params: {
              location: `${location.lat},${location.lng}`,
              timestamp: Math.floor(Date.now() / 1000),
              key: apiKey,
            },
          },
        );

        const timezone = timezoneResponse.data.timeZoneId;

        setFieldValue("address", address);
        setFieldValue("landmark", landmark);
        setFieldValue("country_code", country);
        setFieldValue("timezone", timezone);
        setFieldValue("city", city);
        setFieldValue("state", state);
        setFieldValue("zip_code", postalCode);
        setFieldValue("latitude", location.lat);
        setFieldValue("longitude", location.lng);
        setFetchingLocation(false);
      } else {
        toast.error("Couldn't find address");
        console.error(
          "Geocode was not successful for the following reason:",
          geocodeResponse.data.status,
        );
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast.error("Error fetching location data");
    } finally {
      setFetchingLocation(false);
    }
  };
  return (
    <FlexContainer variant="column-center">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
        }) => {
          return (
            <Form className="w-full max-w-lg">
              <FlexContainer variant="column-start" gap="sm" className="mb-8">
                <h3 className="w-full text-left text-2xl font-medium text-zinc-900">
                  Sign Up to Kernel Krew
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
                {activePage === 0 && (
                  <FlexContainer variant="column-start" gap="lg">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="First Name"
                        labelPlacement="outside"
                        name="first_name"
                        placeholder="Enter your first name"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.first_name}
                        onChange={handleChange}
                        isInvalid={!!errors.first_name && touched.first_name}
                        color={
                          !!errors.first_name && touched.username
                            ? "danger"
                            : "default"
                        }
                        errorMessage={errors.first_name}
                      />
                      <Input
                        label="Last Name"
                        labelPlacement="outside"
                        name="last_name"
                        placeholder="Enter your last name"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.last_name}
                        onChange={handleChange}
                        isInvalid={!!errors.last_name && touched.last_name}
                        color={
                          !!errors.last_name && touched.last_name
                            ? "danger"
                            : "default"
                        }
                        errorMessage={errors.last_name}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        placeholder="Enter your email"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email && touched.email}
                        color={
                          !!errors.email && touched.email ? "danger" : "default"
                        }
                        errorMessage={errors.email}
                      />
                      <Input
                        type="number"
                        label="Phone Number"
                        labelPlacement="outside"
                        name="phone_number"
                        placeholder="Enter your phone number"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.phone_number}
                        onChange={handleChange}
                        isInvalid={
                          !!errors.phone_number && touched.phone_number
                        }
                        color={
                          !!errors.phone_number && touched.phone_number
                            ? "danger"
                            : "default"
                        }
                        errorMessage={errors.phone_number}
                      />
                    </div>
                    <Input
                      type="password"
                      label="Password"
                      name="password"
                      labelPlacement="outside"
                      placeholder="Enter your password"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password && touched.password}
                      color={
                        errors.password && touched.password
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.password}
                    />
                    <Input
                      type="password"
                      label="Confirm Password"
                      name="confirm_password"
                      labelPlacement="outside"
                      placeholder="Confirm your password"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      value={values.confirm_password}
                      onChange={handleChange}
                      isInvalid={
                        !!errors.confirm_password && touched.confirm_password
                      }
                      color={
                        errors.confirm_password && touched.confirm_password
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.confirm_password}
                    />
                    <Input
                      label="Username"
                      labelPlacement="outside"
                      name="username"
                      placeholder="Enter your username"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
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
                      label="Address"
                      labelPlacement="outside"
                      name="address"
                      placeholder="Enter your address"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      onChange={handleChange}
                      endContent={
                        <span
                          onClick={() =>
                            fetchLocationData(values.address, setFieldValue)
                          }
                          className="cursor-pointer text-nowrap rounded-xl border bg-zinc-100 p-1.5 text-xs font-medium"
                        >
                          Fetch location
                        </span>
                      }
                      value={values.address}
                      // onChange={(e) => {
                      //   setFieldValue("address", e.target.value);
                      //   fetchLocationData(e.target.value, setFieldValue);
                      // }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Landmark"
                        labelPlacement="outside"
                        name="landmark"
                        placeholder="Enter your landmark"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.landmark}
                        onChange={handleChange}
                      />
                      <Input
                        label="City"
                        labelPlacement="outside"
                        name="city"
                        placeholder="Enter your city"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.city}
                        onChange={handleChange}
                      />
                      <Input
                        label="State"
                        labelPlacement="outside"
                        name="state"
                        placeholder="Enter your state"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.state}
                        onChange={handleChange}
                      />
                      <Input
                        label="Country"
                        labelPlacement="outside"
                        name="country_code"
                        placeholder="Enter your country"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.country_code}
                        onChange={handleChange}
                      />
                      <Input
                        type="number"
                        label="latitude"
                        labelPlacement="outside"
                        name="latitude"
                        placeholder="Enter your latitude"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.latitude?.toString()}
                        onChange={handleChange}
                      />

                      <Input
                        type="number"
                        label="longitude"
                        labelPlacement="outside"
                        name="longitude"
                        placeholder="Enter your longitude"
                        classNames={{
                          inputWrapper:
                            "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                        }}
                        value={values.longitude?.toString()}
                        onChange={handleChange}
                      />
                    </div>
                    <Checkbox
                      isSelected={values.isServiceProvider}
                      onValueChange={(val) => {
                        setFieldValue("isServiceProvider", val);
                      }}
                    >
                      Are you a service provider?
                    </Checkbox>
                  </FlexContainer>
                )}
                {activePage === 1 && (
                  <>
                    <Select
                      label="Services"
                      labelPlacement="outside"
                      name="services"
                      placeholder="Select Main Category"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={SERVICES}
                      onChange={(e) => {
                        setFieldValue("services", e.target.value);
                      }}
                      selectionMode="multiple"
                      isInvalid={!!errors.services && touched.services}
                      color={
                        !!errors.services && touched.services
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.services && touched.services}
                    >
                      {(item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                      )}
                    </Select>
                    <Input
                      type="number"
                      label="Years of Experience"
                      labelPlacement="outside"
                      name="yearsOfExperience"
                      placeholder="Enter your years of experience"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      onChange={handleChange}
                      isInvalid={
                        !!errors.yearsOfExperience && touched.yearsOfExperience
                      }
                      color={
                        !!errors.yearsOfExperience && touched.yearsOfExperience
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.yearsOfExperience}
                    />
                    <Input
                      type="number"
                      label="Fees (per hour)"
                      labelPlacement="outside"
                      name="feesPerHour"
                      placeholder="Enter your fees per hour"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      onChange={handleChange}
                      isInvalid={!!errors.feesPerHour && touched.feesPerHour}
                      color={
                        !!errors.feesPerHour && touched.feesPerHour
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.feesPerHour}
                    />
                    {/* <Input
                      label="Address"
                      labelPlacement="outside"
                      name="address"
                      placeholder="Enter your address"
                      classNames={{
                        inputWrapper:
                          "shadow-none border-2 rounded-lg focus-within:border-zinc-800 duration-300 transition-all",
                      }}
                      onChange={(e) => {
                        setFieldValue("address", e.target.value);
                        fetchLocationData(e.target.value, setFieldValue);
                      }}
                      isInvalid={!!errors.feesPerHour && touched.feesPerHour}
                      color={
                        !!errors.feesPerHour && touched.feesPerHour
                          ? "danger"
                          : "default"
                      }
                      errorMessage={errors.feesPerHour}
                    /> */}
                  </>
                )}
                <ShadcnButton
                  isLoading={isSubmitting}
                  variant="primary"
                  type="submit"
                >
                  Sign Up
                </ShadcnButton>
                <FlexContainer variant="row-center" gap="md">
                  <p className="text-sm">Already have an account?</p>
                  <Link className="text-sm font-medium" href="/signin">
                    Sign In
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
