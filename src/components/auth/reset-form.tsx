"use client";
import z from "zod";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth-actions";

//@ts-ignore
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

const ResetForm = ({ className }: { className?: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
  });

  const toastId = useId();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending password reset email...", { id: toastId });

    try {
      const { success, error } = await resetPassword({
        email: values?.email || "",
      });
      if (!success) {
        toast.error(error, { id: toastId });
      } else {
        toast.success(
          "Password reset email sent. Please check your email for instruction.",
          { id: toastId }
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "There is an error sending the email", {
        id: toastId,
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full">Reset password</Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetForm;
