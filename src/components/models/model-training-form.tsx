"use client";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "@/actions/model-actions";

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"];
const MAX_FILE_SIZE = 45 * 1924 * 1024;

const formSchema = z.object({
  modelName: z.string({ required_error: "Model name is required" }),
  gender: z.enum(["man", "woman"]),
  zipFile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please select valid files")
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_ZIP_FILES.includes(files?.[0]?.type),
      "Only zip files are accepted"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size allowed is 45MB"
    ),
});

const ModelTrainingForm = () => {
  const toastId = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      gender: "man",
    },
  });
  const fileRef = form.register("zipFile");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Uploading file...", { id: toastId });
    try {
      const data = await getPresignedStorageUrl(values.zipFile[0].name);
      if (data.error) {
        toast.error(data.error || "Failed to upload the file", { id: toastId });
      }

      const urlResponse = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": values.zipFile[0].type,
        },
        body: values.zipFile[0],
      });

      if (!urlResponse.ok) {
        throw new Error("Upload failed!");
      }

      const res = await urlResponse.json();

      toast.success("File uploaded successfully", { id: toastId });

      const formData = new FormData();
      formData.append("fileKey", res.Key);
      formData.append("modelName", values.modelName);
      formData.append("gender", values.gender);

      toast.loading("Initiating model training", { id: toastId });

      const response = await fetch("/api/train", {
        method: "POST",
        body: formData,
      });

      const results = await response.json();

      if (!response.ok || results?.error) {
        throw new Error(results?.error || "Failed to train the model");
      }
      toast.success(
        "Training started successfully.You'll recieve a notification when training is finished",
        { id: toastId }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start training";
      toast.error(errorMessage || "Failed to upload the file", {
        id: toastId,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="grid max-w-5xl bg-background p-4 sm:p-8 rounded-lg gap-6 border">
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter model name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select the gender of images</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Man</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="women" />
                      </FormControl>
                      <FormLabel className="font-normal">Women</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Training Data (zip file)
                  <span className="text-destructive ml-2">
                    Read the requirements below.
                  </span>
                  <div className="mb-4 rounded-lg shadow-sm pb-4 text-card-foreground">
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-3">
                      <li> Provide 10, 12 or 15 images in total </li>
                      <li>
                        Ideal breakdown for 12 images:
                        <ul className="ml-4 mt-1 space-y-3">
                          <li>- 6 face closeups</li>
                          <li>- 3/4 half body closeups (till stomach)</li>
                          <li>- 2/3 full body shots</li>
                        </ul>
                      </li>
                      <li> No accessories on face/head ideally</li>
                      <li>No other people in images </li>{" "}
                      <li>
                        Different expressions, clothing, backgrounds with good
                        lighting
                      </li>
                      <li>
                        Images to be in 1:1 resolution (1048x1048 or higher)
                      </li>
                      <li>
                        Use images of similar age group (ideally within past few
                        months)
                      </li>
                      <li>Provide only zip file (under 45MB size)</li>
                    </ul>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input type="file" accept=".zip" {...fileRef} />
                </FormControl>
                <FormDescription>
                  Upload a zip file containing your training images ( max 45MB
                  ).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default ModelTrainingForm;
