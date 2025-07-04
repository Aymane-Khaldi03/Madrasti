import { useLocation } from "wouter";
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BookOpen,
  BarChart2,
  LogOut,
} from "lucide-react";

export default function SidebarNav() {
  const [location] = useLocation();

  const link = (to: string) => location === to;

  return (
    <>
      <SidebarHeader className="px-4">
        <span className="text-xl font-bold text-white">EduSphere</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={link("/admin")}>
              <a href="/admin">
                <Home />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Dashboard
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={link("/admin/users")}>
              <a href="/admin/users">
                <Users />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Users
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={link("/admin/courses")}>
              <a href="/admin/courses">
                <BookOpen />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Courses
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={link("/admin/analytics")}>
              <a href="/admin/analytics">
                <BarChart2 />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Analytics
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <button onClick={() => console.log("TODO: sign-out")} className="w-full text-left">
                <LogOut />
                <span className="group-data-[collapsible=icon]:sr-only">
                  Sign-out
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
