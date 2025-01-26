"use client";
import z from "zod";
import React, { useId, useState } from "react";
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
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/actions/auth-actions";

//@ts-ignore
const formSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Your name must be atleast 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email" }),
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

const SignupForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const toastId = useId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.loading("Signing up...", { id: toastId });
      setLoading(true);
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("fullname", values.fullname);
      formData.append("password", values.password);

      const { success, error } = await signup(formData);

      if (!success) {
        toast.error(String(error), { id: toastId });
        setLoading(false);
      } else {
        toast.success("Signed up successfully!", { id: toastId });
        setLoading(false);
        redirect("/login");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full">
            {loading && <Loader className="mr-2 size-4 animate-spin" />}Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
