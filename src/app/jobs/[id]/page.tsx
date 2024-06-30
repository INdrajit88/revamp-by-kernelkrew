"use client";

import { useGlobalContext } from "@/components/ContextProvider";
import FlexContainer from "@/components/FlexContainer";
import ShadcnButton from "@/components/ShadcnButton";
import Wrapper from "@/components/Wrapper";
import { Avatar, Input, Textarea } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { ObjectId } from "mongodb";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

export interface MongoJob {
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
    comment: string;
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
    comment: string;
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
  const { user } = useGlobalContext();
  const [job, setJob] = useState<MongoJob | null>(null);
  const [initialValue, setInitialValue] = useState({
    title: "",
    description: "",
    budget: 0,
    location: "",
  });
  const router = useRouter();
  const [bids, setBids] = useState<MongoJob["bids"][]>([]);
  const [images, setImages] = useState<{ label: string; url: string }[]>([]);
  const [isBidPlaced, setIsBidPlaced] = useState(false);
  console.log(images, "images");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch("/api/jobs/" + id);
        const data = await response.json();
        if (data.success) {
          setJob(data.data);
          setInitialValue({
            title: data.data.title,
            description: data.data.description,
            budget: data.data.budget,
            location: data.data.location,
          });
          // if (data?.data?.bids?.length > 0) {
          //   for (const bid of data.data.bids) {
          //     if (bid.user.id === user?._id) {
          //       setIsBidPlaced(true);
          //     }
          //   }
          // }
          for (let i = 0; i < data?.data?.bids?.length; i++) {
            if (data.data.bids[i].user.id === user?._id.toString()) {
              setIsBidPlaced(true);
              break;
            }
          }
          setImages(data.data.images);
          setBids(data.data.bids);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        const err = error as Error & { message: string };
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (
    values: {
      comment: string;
      commentBy: string;
      bidPrice: number;
    },
    actions: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      const bid = {
        comment: values.comment,
        amount: values.bidPrice,
        user: {
          id: user?._id,
          email: user?.email,
          username: user?.username,
          ratings: user?.ratings,
        },
      };
      const res = await fetch("/api/jobs/bid/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id, ...bid }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data.message);
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
      console.log();
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    }
  };
  return (
    <Wrapper className="px-10 py-5">
      {job && (
        <FlexContainer variant="column-start" gap="xl">
          <Input
            name="title"
            variant="flat"
            placeholder="Enter job title"
            classNames={{
              base: "h-auto",
              input: "text-7xl h-auto",
              inputWrapper: "h-auto bg-transparent shadow-none",
            }}
            value={initialValue?.title}
          />
          <Textarea
            name="description"
            variant="flat"
            placeholder="Enter job description"
            classNames={{
              base: "h-auto",
              input: "text-4xl h-auto",
              inputWrapper: "h-auto bg-transparent shadow-none",
            }}
            value={initialValue?.description}
            onChange={(e) => {}}
          />
          <div className="grid grid-cols-4 gap-2">
            <Input
              type="number"
              name="budget"
              variant="flat"
              placeholder="Enter job budget (₹)"
              classNames={{
                base: "h-auto",
                input: "text-md h-auto",
                inputWrapper: "h-auto bg-zinc-100 rounded-xl",
              }}
              value={initialValue?.budget?.toString()}
              onChange={(e) => {}}
            />
            <Input
              variant="flat"
              //address
              name="location"
              placeholder="Enter location"
              classNames={{
                base: "h-auto",
                input: "text-md h-auto",
                inputWrapper: "h-auto bg-zinc-100 rounded-xl",
              }}
              value={initialValue.location}
              onChange={(e) => {}}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {job.images &&
              job.images.map((image, index) => {
                return (
                  <Image
                    key={index}
                    src={image.url}
                    alt={image.label}
                    width={300}
                    height={300}
                    className="h-full w-full rounded-md object-cover"
                  />
                );
              })}
          </div>
          {bids?.length > 0 && (
            <FlexContainer variant="column-start" gap="sm">
              <h5 className="text-lg font-bold">Bids</h5>
              {bids.map((bid, index) => {
                return (
                  <FlexContainer key={index} variant="row-between">
                    <FlexContainer
                      key={index}
                      variant="column-start"
                      gap="sm"
                      className="w-full rounded-xl bg-zinc-100 p-3"
                    >
                      <FlexContainer variant="row-start" gap="sm">
                        <Avatar
                          name={bid.user.username}
                          className="h-12 w-12 rounded-xl"
                        />
                        <FlexContainer variant="column-start" gap="none">
                          <h5 className="text-lg font-bold">
                            {bid.user.username}
                          </h5>
                          <p className="text-sm font-medium text-zinc-800">
                            {bid.user.email}
                          </p>
                        </FlexContainer>
                      </FlexContainer>
                      <p className="text-sm font-medium text-zinc-800">
                        Bid Price: {bid.amount}
                      </p>
                      <p className="text-sm font-medium text-zinc-800">
                        Comment: {bid.comment}
                      </p>
                    </FlexContainer>
                    {user?._id === job.postAdmin.id && (
                      <ShadcnButton
                        variant="secondary"
                        onClick={async () => {
                          const res = await fetch("/api/jobs/bid/accept", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ postId: id, bidId: bid.id }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            toast.success(data.message);
                            router.push("/jobs/me");
                          } else {
                            toast.error(data.message);
                          }
                        }}
                        className="rounded-xl"
                        isDisabled={job.status !== "open"}
                      >
                        Accept
                      </ShadcnButton>
                    )}
                  </FlexContainer>
                );
              })}
            </FlexContainer>
          )}
          {user?._id !== job.postAdmin.id && (
            <Formik
              initialValues={{
                comment: "",
                commentBy: "",
                bidPrice: 0,
              }}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, isSubmitting, errors, touched }) => {
                return (
                  <Form>
                    <FlexContainer
                      variant="row-start"
                      className="items-center"
                      gap="sm"
                    >
                      <Avatar name={user?.email} />
                      <FlexContainer variant="column-start" gap="none">
                        <h5 className="text-lg font-bold">{user?.username}</h5>
                        <p className="text-sm font-medium text-zinc-800">
                          {user?.email}
                        </p>
                      </FlexContainer>
                    </FlexContainer>
                    <div className="mt-3 grid grid-cols-4 gap-4">
                      <Input
                        name="comment"
                        variant="flat"
                        placeholder="Enter your comment"
                        classNames={{
                          base: "h-auto col-span-2",
                          input: "text-sm h-auto",
                          inputWrapper: "border shadow-none",
                        }}
                        onChange={handleChange}
                        isDisabled={isBidPlaced}
                      />
                      <Input
                        type="number"
                        name="bidPrice"
                        variant="flat"
                        placeholder="Enter your bid price"
                        classNames={{
                          base: "h-auto",
                          input: "text-sm h-auto",
                          inputWrapper: "border shadow-none",
                        }}
                        onChange={handleChange}
                        isDisabled={isBidPlaced}
                      />
                    </div>
                    <FlexContainer
                      variant="row-start"
                      gap="sm"
                      className="mt-3"
                    >
                      <ShadcnButton isDisabled={isBidPlaced} type="submit">
                        Submit
                      </ShadcnButton>
                    </FlexContainer>
                  </Form>
                );
              }}
            </Formik>
          )}
        </FlexContainer>
      )}
    </Wrapper>
  );
};

export default Page;
