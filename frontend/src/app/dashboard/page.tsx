"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, AlertCircle, Eye, Check } from "lucide-react"
import * as React from 'react';
import { useState, useEffect } from 'react';


// Mock data for recent activities
const recentActivities = [
  { id: 1, user: "John Doe", action: "Uploaded video", timestamp: "2 minutes ago", status: "success" },
  { id: 2, user: "Jane Smith", action: "Uploaded video", timestamp: "1 hour ago", status: "success" },
  { id: 3, user: "You", action: "Approved content", timestamp: "3 hours ago", status: "success" },
  { id: 4, user: "Sarah Williams", action: "Edited video", timestamp: "Yesterday", status: "warning" },
  { id: 5, user: "You", action: "Rejected video", timestamp: "Yesterday", status: "error" },
]

// Mock data for pending approvals

export default function Dashboard() {
  const [pendingApprovals, setPendingApprovals] =useState( [
    { id: 1, title: "Product Launch Video", submitter: "Jane Smith", submitted: "2 hours ago",  },
    { id: 2, title: "Q1 Results Presentation", submitter: "Mike Johnson", submitted: "5 hours ago", },
    { id: 3, title: "New Marketing Campaign", submitter: "Sarah Williams", submitted: "Yesterday", },
    { id: 4, title: "Customer Testimonial", submitter: "David Brown", submitted: "2 days ago",  },
  ]);

  return (
    <div className="space-y-6 w-[79vw]">
      <div className="grid gap-6 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]">
        <Card>
          <CardHeader className="">
            <CardTitle className="text-sm ">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="-my-3">
            <div className="text-2xl font-bold pb-3">7</div>
            <p className="text-xs text-muted-foreground ">+3 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="-pb-6">
            <CardTitle className="text-sm ">Content Approved (This Week)</CardTitle>
          </CardHeader>
          <CardContent className="-my-3">
            <div className="text-2xl font-bold pb-3">24</div>
            <p className="text-xs text-muted-foreground ">+5 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals">
        <TabsList>
          <TabsTrigger className="" value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger className="" value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="mt-6 w-[65vw]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl ">Pending Approvals</CardTitle>
              <CardDescription className="">Content waiting for your review</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Title</TableHead>
                      <TableHead className="text-muted-foreground">Submitter</TableHead>
                      <TableHead className="text-muted-foreground">Submitted</TableHead>
                      <TableHead className="text-muted-foreground pl-5">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className=" h-14">{item.title}</TableCell>
                        <TableCell className="">{item.submitter}</TableCell>
                        <TableCell className="">{item.submitted}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-4 w-4" /> Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-green-50 p-3 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">There are no pending approvals at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6 w-[65vw]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl ">Activity Log</CardTitle>
              <CardDescription className="">Recent actions performed in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Action</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className=" h-14">{activity.user}</TableCell>
                      <TableCell className="">{activity.action}</TableCell>
                      <TableCell className="">{activity.timestamp}</TableCell>
                      <TableCell>
                        {activity.status === "success" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" /> Success
                          </Badge>
                        )}
                        {activity.status === "warning" && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                            <Clock className="mr-1 h-3 w-3" /> Warning
                          </Badge>
                        )}
                        {activity.status === "error" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                            <AlertCircle className="mr-1 h-3 w-3" /> Error
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

