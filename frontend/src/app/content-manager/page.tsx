/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import * as React from 'react';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Upload, Edit, Trash, Clock, CheckCircle, XCircle, Calendar, FileVideo, X, ImageIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { set, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Progress } from '@/components/ui/progress';

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
  const [uploads, setUploads] = useState(initialUploads);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isVideoUploadComplete, setIsVideoUploadComplete] = useState(false);
  const [isThumbnailUploadComplete, setIsThumbnailUploadComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const videoProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getMinDateTimeLocal = () => {
    const now = new Date();
    // Adjust for timezone offset to get local time in ISO-like format for the input
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localNow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const simulateProgress = (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
    setIsCompleteArg: React.Dispatch<React.SetStateAction<boolean>> 
  ) => {
    setProgress(0); 

    // Defensive check: Ensure setIsCompleteArg is a function
    if (typeof setIsCompleteArg !== 'function') {
      console.error("simulateProgress Error: setIsCompleteArg is not a function. Received:", setIsCompleteArg);
      toast.error("An internal error occurred while simulating progress.");
      return; // Exit the function to prevent further errors
    }

    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset states for a new simulation
    setIsCompleteArg(false); // Use the validated argument

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += 10;

      if (currentProgress < 100) {
        setProgress(currentProgress);
      } else {
        // Progress has reached 100% or more
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // First, ensure progress is set to 100
        setProgress(100);
        // Then, schedule setIsCompleteArg to run after the current execution context
        Promise.resolve().then(() => {
            // Double-check before calling
            if (typeof setIsCompleteArg === 'function') { 
                setIsCompleteArg(true);
            } else {
                console.error("simulateProgress Error: setIsCompleteArg became invalid before Promise resolved. Received:", setIsCompleteArg);
            }
        });
      }
    }, 150); // Adjust interval time for speed
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "video/mp4") {
        setVideoFile(file);
        simulateProgress(setVideoUploadProgress, videoProgressIntervalRef, setIsVideoUploadComplete);
        toast.success("Video selected: " + file.name);
      } else {
        toast.error("Invalid file type. Please select an MP4 video.");
        setVideoFile(null);
        setVideoUploadProgress(0);
      }
    }
    event.target.value = ''; // Reset input value
  };

  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingVideo(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type === "video/mp4") {
        setVideoFile(file);
        simulateProgress(setVideoUploadProgress, videoProgressIntervalRef, setIsVideoUploadComplete);
        toast.success("Video dropped: " + file.name);
      } else {
        toast.error("Invalid file type. Please drop an MP4 video.");
        setVideoFile(null);
        setVideoUploadProgress(0);
      }
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    setVideoUploadProgress(0);
    if (videoProgressIntervalRef.current) clearInterval(videoProgressIntervalRef.current);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        simulateProgress(setThumbnailUploadProgress, thumbnailProgressIntervalRef, setIsThumbnailUploadComplete);
        toast.success("Thumbnail selected: " + file.name);
      } else {
        toast.error("Invalid file type. Please select an image.");
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnailUploadProgress(0);
      }
    }
     event.target.value = ''; // Reset input value
  };

  const handleThumbnailDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingThumbnail(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        simulateProgress(setThumbnailUploadProgress, thumbnailProgressIntervalRef, setIsThumbnailUploadComplete);
        toast.success("Thumbnail dropped: " + file.name);
      } else {
        toast.error("Invalid file type. Please drop an image.");
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnailUploadProgress(0);
      }
    }
  };

  const clearThumbnailFile = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setThumbnailUploadProgress(0);
    if (thumbnailProgressIntervalRef.current) clearInterval(thumbnailProgressIntervalRef.current);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Form setup
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      scheduledTime: "",
    },
  });

  const onSubmit = async (data: videoDataForm) => {
    // Clear previous manual errors for scheduledTime
    form.clearErrors("scheduledTime");
    setIsSubmitting(true);

    if (!data.title || !data.description || !data.tags) {
      toast.error("Please fill in all required text fields.");
      setIsSubmitting(false);
      return;
    }
    if (!videoFile) {
      toast.error("Please select a video file.");
      setIsSubmitting(false);
      return;
    }
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image.");
      setIsSubmitting(false);
      return;
    }

    // Validate scheduledTime if provided
    if (data.scheduledTime) {
      const parsedDate = new Date(data.scheduledTime);
      // Check if the date is valid. getTime() on an Invalid Date returns NaN.
      if (isNaN(parsedDate.getTime())) {
        form.setError("scheduledTime", {
          type: "manual",
          message: "Invalid date format. Please use the date picker or ensure YYYY-MM-DDTHH:MM format."
        });
        setIsSubmitting(false);
        return;
      }
      // Check if the date is in the past (allowing a small buffer like 1 minute for submission delays)
      const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000);
      if (parsedDate < oneMinuteAgo) {
        form.setError("scheduledTime", {
          type: "manual",
          message: "Scheduled time cannot be in the past. Please select a future date and time."
        });
        setIsSubmitting(false);
        return;
      }
    }

    console.log("Form submitted:", data);
    console.log("Video File:", videoFile);
    console.log("Thumbnail File:", thumbnailFile);
    
    
    // Add to uploads with pending status
    const newUpload: videoData = {
      id: uploads.length > 0 ? Math.max(...uploads.map((u) => u.id)) + 1 : 1,
      title: data.title,
      description: data.description,
      tags: data.tags,
      uploadDate: new Date().toISOString().split("T")[0],
      status: data.scheduledTime ? "Scheduled" : "Pending",
      feedback: data.scheduledTime ? `Scheduled for ${new Date(data.scheduledTime).toLocaleString()}` : "",
    };
    
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
    toast.success("Video submitted for approval!");
    setIsSubmitting(false);
    setUploads([newUpload, ...uploads]);
    form.reset();
    clearVideoFile();
    clearThumbnailFile();
  };

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="flex flex-row items-center justify-center space-x-15">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center flex flex-col items-center justify-center h-64 w-96
                    ${isDraggingVideo ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${videoFile ? 'border-green-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={() => setIsDraggingVideo(true)}
                    onDragLeave={() => setIsDraggingVideo(false)}
                    onDrop={handleVideoDrop}>
                      <input type="file" ref={videoInputRef} onChange={handleVideoFileChange} accept="video/mp4" className="hidden" />
                      {videoFile ? (
                        <div className="w-full h-full flex flex-col justify-between items-center p-2"> {/* Modified for consistent height */}
                          <div className="flex justify-between items-center w-full">
                            <FileVideo className="h-10 w-10 text-blue-500" />
                            <Button variant="ghost" size="sm" onClick={clearVideoFile} aria-label="Remove video file">
                                <X className="h-5 w-5 text-red-500 hover:text-red-700"/>
                            </Button>
                          </div>
                          <div className="flex-grow flex flex-col justify-center items-center w-full overflow-hidden py-1">
                              <p className="text-sm font-medium text-gray-700 truncate w-full" title={videoFile.name}>{videoFile.name}</p>
                              <p className="text-xs text-muted-foreground w-full">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          {videoUploadProgress > 0 && !isVideoUploadComplete && (
                            <div className="w-full pt-1">
                                <Progress value={videoUploadProgress} className="w-full h-2" />
                            </div>
                          )}
                          {isVideoUploadComplete && (
                            <div className="w-full pt-1 text-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                <p className="text-xs text-green-600">Ready</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm font-medium">Drag & drop video here, or</p>
                          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => videoInputRef.current?.click()}>
                            Select Video File
                          </Button>
                          <p className="mt-1 text-xs text-muted-foreground">MP4 format only, max 100MB</p>
                        </>
                      )}
                    </div>

                    <div className={`border-2 border-dashed rounded-lg p-6 text-center flex flex-col items-center justify-center h-64 w-96
                    ${isDraggingThumbnail ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${thumbnailFile ? 'border-green-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={() => setIsDraggingThumbnail(true)}
                    onDragLeave={() => setIsDraggingThumbnail(false)}
                    onDrop={handleThumbnailDrop}>
                      <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailFileChange} accept="image/*" className="hidden" />
                      {thumbnailFile ? (
                        <div className="w-full h-full flex flex-col justify-between items-center p-2"> {/* Modified for consistent height */}
                           <div className="flex justify-end items-start w-full"> {/* Aligned clear button to top-right */}
                                <Button variant="ghost" size="sm" onClick={clearThumbnailFile} aria-label="Remove thumbnail file" className="p-1 h-auto">
                                    <X className="h-5 w-5 text-red-500 hover:text-red-700"/>
                                </Button>
                            </div>
                            <div className="flex-grow flex flex-col justify-center items-center w-full overflow-hidden py-1">
                                {thumbnailPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="mx-auto max-h-24 object-contain rounded-md mb-2" /> // Adjusted max-h
                                ) : (
                                    <ImageIcon className="mx-auto h-10 w-10 text-blue-500 mb-2" />
                                )}
                                <p className="text-sm font-medium text-gray-700 truncate w-full" title={thumbnailFile.name}>{thumbnailFile.name}</p>
                                <p className="text-xs text-muted-foreground w-full">{(thumbnailFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                            {thumbnailUploadProgress > 0 && !isThumbnailUploadComplete && (
                            <div className="w-full pt-1">
                                <Progress value={thumbnailUploadProgress} className="w-full h-2" />
                            </div>
                          )}
                          {isThumbnailUploadComplete && ( 
                            <div className="w-full pt-1 text-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                <p className="text-xs text-green-600">Ready</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm font-medium">Drag & drop thumbnail, or</p>
                          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => thumbnailInputRef.current?.click()}>
                            Select Thumbnail
                          </Button>
                          <p className="mt-1 text-xs text-muted-foreground">Image formats, max 5MB</p>
                        </>
                      )}
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
                          <Input type="datetime-local" {...field} min={getMinDateTimeLocal()} />
                        </FormControl>
                        <FormDescription>Leave empty to upload immediately after approval</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting? <Loader2 className='animate-spin h-5 w-5'/> :"Submit for Admin Approval"}
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

