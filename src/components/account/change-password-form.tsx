"use client";
import z from "zod";
import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { changePassword } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

//@ts-ignore
const formSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords did not match",
    path: ["confirmPassword"],
  });

const ChangePasswordForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toastId = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.loading("Changing password...", { id: toastId });
      setLoading(true);

      const { success, error } = await changePassword(values.password);

      if (!success) {
        toast.error(String(error), { id: toastId });
        setLoading(false);
      } else {
        toast.success("Password updated successfully!", { id: toastId });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(String(error?.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to change or update your password
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a strong password that meets the requirements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormDescription>
                  Re-enter your new password to confirm.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full pt-4">
            {loading && <Loader className="mr-2 size-4 animate-spin" />}Change
            password
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Make sure to remember your new password or store it securely.
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
