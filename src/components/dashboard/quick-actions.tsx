import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CreditCardIcon, PlusIcon, Wand2Icon } from "lucide-react";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        <CardDescription>Get started with common actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button asChild className="w-full">
          <Link href={"/image-generation"}>
            <Wand2Icon className="size-4 mr-2" /> Generate Image
          </Link>
        </Button>
        <Button asChild className="w-full" variant={"destructive"}>
          <Link href={"/model-training"}>
            <PlusIcon className="size-4 mr-2" /> Train New Model
          </Link>
        </Button>
        <Button asChild className="w-full" variant={"secondary"}>
          <Link href={"/billing"}>
            <CreditCardIcon className="size-4 mr-2" /> Billing
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
