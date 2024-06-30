"use client";

import { User, useGlobalContext } from "@/components/ContextProvider";
import FlexContainer from "@/components/FlexContainer";
import Loader from "@/components/Loader";
import ShadcnButton from "@/components/ShadcnButton";
import Tab from "@/components/Tabs";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/react";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

interface MongoUser {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  username: string;
  isServiceProvider: boolean;
  location: {
    type: string;
    coordinates: [number, number];
  };
  locationDetails: {
    address: string;
    city: string;
    country_code: string;
    landmark: string;
    state: string;
    timezone: string;
    zip_code: null;
  };
  feesPerHour: number;
  yearsOfExperience: number;
  services: string[];
}

export interface MongoJobs {
  _id: ObjectId;
  title: string;
  description: string;
  budget: number;
  location: string;
  images?: { label: string; url: string }[];
  postAdmin: {
    id: ObjectId;
    username: string;
    email: string;
    ratings: number;
  };
  bids: {
    id: ObjectId;
    amount: number;
    user: {
      id: ObjectId;
      username: string;
      email: string;
      ratings: number;
    };
  };
  status: "open" | "in-progress" | "closed";
  acceptedBid: {
    id: ObjectId;
    amount: number;
    user: {
      id: ObjectId;
      username: string;
      email: string;
      ratings: number;
    };
  };
  createdAt: Date;
}

const Page = (props: Props) => {
  const { user, isLoaded } = useGlobalContext();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
    }
  }, []);

  console.log(user, "user");
  return (
    <Wrapper className="px-10 py-5">
      <FlexContainer variant="column-start" gap="xl">
        <FlexContainer variant="row-between">
          <FlexContainer variant="column-start" gap="none">
            <h3 className="text-3xl font-bold">Dashboard</h3>
            <h5 className="text-lg font-medium text-gray-500">
              Search for nearby service providers
            </h5>
          </FlexContainer>
          <Link href="/jobs/me">
            <ShadcnButton variant="default">My Jobs</ShadcnButton>
          </Link>
        </FlexContainer>
        <FlexContainer variant="row-start" className="overflow-x-auto">
          {user?.isServiceProvider && (
            <Tab
              title="Work"
              isActiveTab={activeTab === 1}
              onClick={() => handleTabClick(1)}
            />
          )}
          <Tab
            title="Nearby Service Providers"
            isActiveTab={activeTab === 2}
            onClick={() => handleTabClick(2)}
          />
          <Tab
            title="Order Histroy"
            isActiveTab={activeTab === 3}
            onClick={() => handleTabClick(3)}
          />
        </FlexContainer>
        {activeTab === 1 && <AllJobs />}
        {activeTab === 2 && <ServiceProviders />}
        {activeTab === 3 && <OrderHistroy />}
      </FlexContainer>
    </Wrapper>
  );
};

const ServiceProviders = () => {
  const [nearbyProviders, setNearbyProviders] = React.useState<MongoUser[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/providers/nearby");
        const data = await res.json();
        if (data.success) {
          setNearbyProviders(data.data);
          toast.success(data.message);
          console.log(data.data, "data");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <FlexContainer variant="column-start">
      {isLoading && <Loader />}
      {nearbyProviders.length > 0 &&
        nearbyProviders.map((item, i) => {
          return (
            <FlexContainer
              key={i}
              variant="row-between"
              className="rounded-xl bg-zinc-100 p-2.5"
            >
              <FlexContainer variant="row-start">
                <Avatar
                  showFallback
                  // src="https://images.unsplash.com/broken"
                  className="h-12 w-12 rounded-xl"
                />
                <FlexContainer variant="column-start" gap="none">
                  <h5 className="text-lg font-bold">
                    {item.first_name} + {item.last_name}
                  </h5>
                  <p className="text-sm font-medium text-zinc-800">
                    {item.locationDetails.address}
                  </p>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer variant="row-end" gap="xl">
                <FlexContainer
                  variant="column-end"
                  gap="none"
                  className="justify-center"
                >
                  <p className="text-sm font-medium text-zinc-800">
                    Category {item.services.join(", ")}
                  </p>
                  <p className="text-sm font-medium text-zinc-800">
                    Fees (per hour): {item.feesPerHour}
                  </p>
                </FlexContainer>
                <ShadcnButton variant="primary" className="rounded-3xl">
                  Hire
                </ShadcnButton>
              </FlexContainer>
            </FlexContainer>
          );
        })}
    </FlexContainer>
  );
};
const AllJobs = () => {
  const [jobs, setJobs] = React.useState<MongoJobs[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/jobs/all");
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
          toast.success(data.message);
          console.log(data.data, "data");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <FlexContainer variant="column-start">
      {isLoading && <Loader />}
      {jobs.length > 0 &&
        jobs.map((item, i) => {
          return (
            <Link href={`/jobs/${item._id}`} key={i}>
              <FlexContainer
                key={i}
                variant="row-between"
                className="rounded-xl bg-zinc-100 p-2.5"
              >
                <FlexContainer variant="row-start">
                  <Avatar
                    showFallback
                    src={item?.images?.length ? item.images[0].url : ""}
                    className="h-12 w-12 rounded-xl"
                  />
                  <FlexContainer variant="column-start" gap="none">
                    <h5 className="text-lg font-bold">{item.title}</h5>
                    <p className="text-sm font-medium text-zinc-800">
                      {item.description}
                    </p>
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer variant="row-end" gap="xl">
                  <FlexContainer
                    variant="column-end"
                    gap="none"
                    className="justify-center"
                  >
                    <p className="text-sm font-medium text-zinc-800">
                      Budget {item.budget}
                    </p>
                    <p className="text-sm font-medium text-zinc-800">
                      by: {item?.postAdmin?.username}
                    </p>
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>
            </Link>
          );
        })}
    </FlexContainer>
  );
};

const OrderHistroy = () => {
  const [orders, setOrders] = React.useState<MongoJobs[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/orders/all");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
          toast.success(data.message);
          console.log(data.data, "data");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <FlexContainer variant="column-start">
      {isLoading && <Loader />}
      {orders.length === 0 && <h3>No orders found</h3>}
      {orders.length > 0 &&
        orders.map((item, i) => {
          return (
            <Link
              href={`/jobs/${item._id}`}
              key={i}
              className={cn(
                "rounded-xl bg-zinc-100 p-2.5",
                item.status === "open" && "bg-red-50",
                item.status === "in-progress" && "bg-yellow-50",
                item.status === "closed" && "bg-green-50",
              )}
            >
              <FlexContainer variant="row-end" className="mb-1">
                <h3 className="rounded-3xl px-1.5 py-1 text-sm font-medium">
                  status: {item.status}
                </h3>
                {/*  */}
              </FlexContainer>
              <FlexContainer
                key={i}
                variant="row-between"
                className={cn(
                  "rounded-xl bg-zinc-100 p-2.5",
                  item.status === "open" && "bg-red-100",
                  item.status === "in-progress" && "bg-yellow-200",
                  item.status === "closed" && "bg-green-200",
                )}
              >
                <FlexContainer variant="row-start">
                  <Avatar
                    showFallback
                    src={item?.images?.length ? item.images[0].url : ""}
                    className="h-12 w-12 rounded-xl"
                  />
                  <FlexContainer variant="column-start" gap="none">
                    <h5 className="text-lg font-bold">{item.title}</h5>
                    <p className="text-sm font-medium text-zinc-800">
                      {item.description}
                    </p>
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer variant="row-end" gap="xl">
                  <FlexContainer
                    variant="column-end"
                    gap="none"
                    className="justify-center"
                  >
                    <p className="text-sm font-medium text-zinc-800">
                      Budget {item.budget}
                    </p>
                    <p className="text-sm font-medium text-zinc-800">
                      by: {item?.postAdmin?.username}
                    </p>
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>
            </Link>
          );
        })}
    </FlexContainer>
  );
};
export default Page;
