"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Clock, AlertCircle, Eye, Check, X } from "lucide-react"
import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";

interface ApprovalItem{
  id: number;
  title: string;
  submitter: string;
  submitted: string;
  description: string;
  tags: string;
  thumbnail: string
}

const recentActivities = [
  { id: 1, name: "John Doe", action: "Uploaded video", timestamp: "2 minutes ago", status: "success" },
  { id: 2, name: "Jane Smith", action: "Uploaded video", timestamp: "1 hour ago", status: "success" },
  { id: 3, name: "You", action: "Approved content", timestamp: "3 hours ago", status: "success" },
  { id: 4, name: "Sarah Williams", action: "Edited video", timestamp: "Yesterday", status: "warning" },
  { id: 5, name: "You", action: "Rejected video", timestamp: "Yesterday", status: "error" },
]

export default function Dashboard() {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([
    { 
      id: 1, 
      title: "Product Launch Video", 
      submitter: "Jane Smith", 
      submitted: "2 hours ago", 
      description: "A video about our new product launch", 
      tags: "#launch, #product",
      thumbnail: "dummy_thumbnail.jpg",
    },
    { 
      id: 2, 
      title: "Q1 Results Presentation", 
      submitter: "Mike Johnson", 
      submitted: "5 hours ago", 
      description: "Presentation on Q1 performance and results", 
      tags: "#Q1, #presentation",
      thumbnail: "dummy_thumbnail.jpg",
    },
    { 
      id: 3, 
      title: "New Marketing Campaign", 
      submitter: "Sarah Williams", 
      submitted: "Yesterday", 
      description: "Details about our upcoming marketing campaign", 
      tags: "#marketing, #campaign",
      thumbnail: "dummy_thumbnail.jpg",
    },
    { 
      id: 4, 
      title: "Customer Testimonial", 
      submitter: "David Brown", 
      submitted: "2 days ago", 
      description: "Testimonial video from a satisfied customer", 
      tags: "#testimonial, #customer",
      thumbnail: "dummy_thumbnail.jpg",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem>();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  const handleApproveClick = (item: ApprovalItem) => {
    setEditedMetadata({
      title: item.title,
      description: item.description,
      tags: item.tags,
    });
    setIsApproveDialogOpen(true);
  }

  const handleRejectClick = (item: ApprovalItem) => {
    setRejectionFeedback("");
    setIsRejectDialogOpen(true);
  }

  const confirmApproval = () => {
    // Add API to confirm Approval
    setIsApproveDialogOpen(false);
  }

  const confirmRejection = () => {
    // Add API to confirm Rejection
    setIsRejectDialogOpen(false);
  }


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
                        <TableCell className="h-14 truncate max-w-[300px]">{item.title}</TableCell>
                        <TableCell className="truncate max-w-[200px]">{item.submitter}</TableCell>
                        <TableCell className="">{item.submitted}</TableCell>
                        <TableCell>
                        <div className="flex space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 p-0 text-green-600"
                                      onClick={() => handleApproveClick(item)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Approve</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-600"
                                      onClick={() => handleRejectClick(item)}
                                    >
                                      <X className="h-8 w-8" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reject</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <Button variant="ghost" size="sm" className="mx-auto pr-15 text-blue-500" onClick={() => handleApproveClick(item)}>
                                <Eye className="mr-1 h-4 w-4" /> View
                              </Button>
                            </div>
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
                      <TableCell className=" h-14">{activity.name}</TableCell>
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
    
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen} >
        <DialogContent className="max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Approve Content</DialogTitle>
            <DialogDescription>Review and approve this content for publishing</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Video Thumbnail Placeholder */}
            <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md">
            <Image className="p-0 m-0" src="/dummy_thumbnail.jpg" alt="Logo" width={1920} height={1080}/>
              {/* <p className="text-slate-400">Video Preview</p> */}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedMetadata.title}
                  onChange={(e) => setEditedMetadata({ ...editedMetadata, title: e.target.value })}
                  autoFocus={false}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="h-20"
                  rows={4}
                  value={editedMetadata.description}
                  onChange={(e) => setEditedMetadata({ ...editedMetadata, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Textarea
                  id="tags"
                  className="h-8"
                  rows={1}
                  value={editedMetadata.tags}
                  onChange={(e) => setEditedMetadata({ ...editedMetadata, tags: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproval} disabled={!editedMetadata.description || !editedMetadata.tags} className="bg-green-600 hover:bg-green-700 active:bg-green-300">
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>Please provide a reason for rejection</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Video Thumbnail Placeholder */}
            <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md">
              <Image className="p-0 m-0" src="/dummy_thumbnail.jpg" alt="Logo" width={1920} height={1080}/>
              {/* <p className="text-slate-400">Video Preview</p> */}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Feedback</Label>
              <Textarea
                id="rejection-reason"
                rows={4}
                placeholder="Explain why this content is being rejected"
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejection} disabled={!rejectionFeedback.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

