"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset, } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Upload, LogOut } from "lucide-react"

export default function ContentManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <h2 className="text-lg font-semibold py-3">Content Manager</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/content-manager"}>
                  <Link className="pl-4" href="/content-manager">
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload Video</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-16 items-center border-b px-6">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">Content Manager Portal</h1>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

