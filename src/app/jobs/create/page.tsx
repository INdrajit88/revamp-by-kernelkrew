"use client";

import FlexContainer from "@/components/FlexContainer";
import ShadcnButton from "@/components/ShadcnButton";
import Wrapper from "@/components/Wrapper";
import { storage } from "@/lib/firebase";
import { Input, Textarea } from "@nextui-org/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Form, Formik } from "formik";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {};

export interface JobsFormI {
  title: string;
  description: string;
  budget: number;
  location: string;
  images?: { label: string; url: string }[];
}

const Page = (props: Props) => {
  const [initialValues, setInitialValues] = useState<JobsFormI>({
    title: "",
    description: "",
    budget: 0,
    location: "",
  });

  const [images, setImages] = useState<{ label: string; url: string }[]>([]);

  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const router = useRouter();

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    console.log(values);
    console.log(images, "images");
    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, images }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        router.push("/jobs/me");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length + images.length <= 5) {
      const imagesLinks = await uploadImagesToFirebase(
        Array.from(e.target.files) as File[],
      );
      setImages([...images, ...imagesLinks]);
      // setImages([...images, ...Array.from(e.target.files)]);
    } else {
      toast.error("You can only upload 5 images");
    }
  };

  console.log(images, "images");

  const uploadImagesToFirebase = async (images: File[]) => {
    const imageUrls = [];

    const t = toast.loading("Uploading images...");
    try {
      for (const image of images) {
        const imageRef = ref(storage, `jobs/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push({
          label: image.name,
          url: imageUrl,
        });
      }
      toast.success("Images uploaded successfully");
      return imageUrls;
    } catch (error) {
      const err = error as Error & { message: string };
      console.error("Error uploading images:", error);
      toast.error(err?.message || "An error occurred while uploading images");
      return [];
    } finally {
      toast.dismiss(t);
    }
  };
  return (
    <Wrapper className="px-10 py-5">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange }) => {
          return (
            <Form>
              <FlexContainer variant="column-start" gap="xl">
                <Input
                  name="title"
                  variant="flat"
                  placeholder="Enter job title"
                  onChange={handleChange}
                  classNames={{
                    base: "h-auto",
                    input: "text-7xl h-auto",
                    inputWrapper: "h-auto bg-transparent shadow-none",
                  }}
                />
                <Textarea
                  name="description"
                  variant="flat"
                  placeholder="Enter job description"
                  onChange={handleChange}
                  classNames={{
                    base: "h-auto",
                    input: "text-4xl h-auto",
                    inputWrapper: "h-auto bg-transparent shadow-none",
                  }}
                />
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    name="budget"
                    variant="flat"
                    placeholder="Enter job budget (₹)"
                    onChange={handleChange}
                    classNames={{
                      base: "h-auto",
                      input: "text-md h-auto",
                      inputWrapper: "h-auto bg-zinc-100 rounded-xl",
                    }}
                  />
                  <Input
                    variant="flat"
                    //address
                    name="location"
                    onChange={handleChange}
                    placeholder="Enter location"
                    classNames={{
                      base: "h-auto",
                      input: "text-md h-auto",
                      inputWrapper: "h-auto bg-zinc-100 rounded-xl",
                    }}
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  <div className="relative w-full rounded-md border-2 border-dashed bg-zinc-100 px-16 py-7">
                    <input
                      type="file"
                      name="images"
                      multiple={true}
                      required
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="absolute inset-0 z-[1] flex items-center justify-center text-sm text-zinc-600">
                      + Add Images
                    </span>
                  </div>
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <Image
                        key={index}
                        src={image.url}
                        alt={image.label}
                        width={300}
                        height={300}
                        className="h-full w-full rounded-md object-cover"
                      />
                    ))}
                </div>
                <FlexContainer variant="row-start">
                  <ShadcnButton type="submit">Create Job</ShadcnButton>
                </FlexContainer>
              </FlexContainer>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Page;
