"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Upload, Edit, Trash, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

interface videoData{
  id: number
  title: string
  description: string
  tags: string
  uploadDate: string
  status: string
  feedback: string
}

interface videoDataForm{
  id: number
  title: string
  description: string
  tags: string
  scheduledTime: string
}

const initialUploads = [
  {
    id: 1,
    title: "Product Demo Video",
    description: "A walkthrough of our new product features",
    tags: "product, demo, features",
    uploadDate: "2023-03-28",
    status: "Approved",
    feedback: "",
  },
  {
    id: 2,
    title: "Company Culture Video",
    description: "Showcasing our company values and culture",
    tags: "culture, company, team",
    uploadDate: "2023-03-25",
    status: "Rejected",
    feedback: "Please add more team interviews and improve audio quality.",
  },
  {
    id: 3,
    title: "Tutorial: Getting Started",
    description: "How to get started with our platform",
    tags: "tutorial, beginner, guide",
    uploadDate: "2023-03-20",
    status: "Pending",
    feedback: "",
  },
  {
    id: 4,
    title: "Q1 Results Announcement",
    description: "CEO announcement of Q1 2023 results",
    tags: "results, announcement, financial",
    uploadDate: "2023-03-15",
    status: "Scheduled",
    feedback: "Scheduled for April 1st, 2023",
  },
];

export default function ContentManagerDashboard() {
  const [uploads, setUploads] = useState(initialUploads)

  // Form setup
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      scheduledTime: "",
    },
  })

  const onSubmit = (data: videoDataForm) => {
    // In a real app, this would handle the form submission
    console.log("Form submitted:", data)

    // Reset form
    form.reset()  

    if(!data.title || !data.description || !data.tags) {
      toast.error("Please fill in all required fields")
      return;
    }
    // Add to uploads with pending status
    const newUpload = {
      id: Math.max(...uploads.map((u) => u.id)) + 1,
      title: data.title,
      description: data.description,
      tags: data.tags,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      feedback: "",
    }

    setUploads([newUpload, ...uploads])
  }

  const handleDelete = (id: number) => {
    setUploads(uploads.filter((upload) => upload.id !== id))
  }

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Content Manager Dashboard</h1>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger className="py-[6.5px] text-sm" value="upload">Upload New Video</TabsTrigger>
          <TabsTrigger className="py-[6.5px] text-sm" value="history">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6 w-[79vw]">
          <Card className='w-[65vw] mx-2'>
            <CardHeader>
              <CardTitle className='text-2xl '>Upload New Video</CardTitle>
              <CardDescription className=''>Upload a new video for admin approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-row items-center justify-center space-x-15">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-[400px] h-[250px]">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm font-medium">Drag and drop your video here, or click here to browse</p>
                        <p className="mt-1 text-xs text-muted-foreground">MP4 format only</p>
                      </div>
                      <Button variant="outline" className="mt-4">
                        Select File
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-[400px] h-[250px]">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm font-medium">Drag and drop your thumbnail here, or click here to browse</p>
                        <p className="mt-1 text-xs text-muted-foreground">Image format only</p>
                      </div>
                      <Button variant="outline" className="mt-4">
                        Select File
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter video title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter video description" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tags separated by commas" {...field} />
                        </FormControl>
                        <FormDescription>Example: tutorial, product, demo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Upload Time (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription>Leave empty to upload immediately after approval</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Submit for Admin Approval
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 w-[79vw]">
          <Card className='w-[65vw]'>
            <CardHeader>
              <CardTitle className='text-2xl '>Upload History & Status</CardTitle>
              <CardDescription className=' '>Track the status of your video uploads</CardDescription>
            </CardHeader>
            <CardContent className='px-8'>
              <Table className=''>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-muted-foreground'>Title</TableHead>
                    <TableHead className='text-muted-foreground'>Upload Date</TableHead>
                    <TableHead className='text-muted-foreground'>Status</TableHead>
                    <TableHead className='text-muted-foreground'>Feedback</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=''>
                  {uploads.map((upload) => (
                    <TableRow key={upload.id} className=''>
                      <TableCell className=" h-16">{upload.title}</TableCell>
                      <TableCell className=''>{upload.uploadDate}</TableCell>
                      <TableCell className=''>
                        {upload.status === "Approved" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" /> Approved
                          </Badge>
                        )}
                        {upload.status === "Pending" && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                            <Clock className="mr-1 h-3 w-3" /> Pending
                          </Badge>
                        )}
                        {upload.status === "Rejected" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                            <XCircle className="mr-1 h-3 w-3" /> Rejected
                          </Badge>
                        )}
                        {upload.status === "Scheduled" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            <Calendar className="mr-1 h-3 w-3" /> Scheduled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{upload.feedback || "—"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {upload.status === "Pending" && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(upload.id)} className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                            {upload.status !== "Pending" && (
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

