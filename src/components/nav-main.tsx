"use client";

import {
  CreditCard,
  Frame,
  Image,
  Images,
  Layers,
  Settings2,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const newItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
  },
  {
    title: "Generate Image",
    url: "/image-generation",
    icon: Image,
  },
  {
    title: "My Models",
    url: "/models",
    icon: Frame,
  },
  {
    title: "Train Model",
    url: "/model-training",
    icon: Layers,
  },
  {
    title: "My Images",
    url: "/gallery",
    icon: Images,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/account-settings",
    icon: Settings2,
  },
];

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {newItems.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={`rounded-none ${
              pathname === item.url
                ? "text-primary bg-primary/5"
                : "text-muted-foreground"
            }`}
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
