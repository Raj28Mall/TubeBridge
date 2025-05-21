"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUserStore } from "@/store/userStore"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, Key, ShieldCheck, Loader2, Lock, LogOut, ArrowLeft, Upload, FileEdit, Youtube, Twitter, Instagram, AlertTriangle, Download, Trash2, } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProfilePage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const logout = useUserStore((state) => state.logout)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    picture: user?.picture || "",
    bio: user?.bio || "",
  })

  const [isUpdating, setIsUpdating] = useState(false);
  const [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contentApproved: true,
    contentRejected: true,
    newUploads: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  // Storage usage stats
  const [storageStats, setStorageStats] = useState({
    used: 2.7, // GB
    total: 10, // GB
    percentage: 27, // %
  })

  // Recent activity
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Changed password", date: "2 days ago" },
    { id: 2, action: "Updated profile picture", date: "1 week ago" },
    { id: 3, action: "Connected YouTube account", date: "2 weeks ago" },
  ])

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error("Please enter your name")
      return
    }

    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (user) {
      setUser({
        ...user,
        name: profileData.name,
        bio: profileData.bio,
        // No email update as it would require verification
      })

      toast.success("Profile updated successfully")
    }

    setIsUpdating(false)
  }

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setIsChangingPassword(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Password changed successfully")
    setIsChangingPassword(false)
    setIsPasswordDialogOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion")
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    logout()
    router.push("/")
    toast.success("Account deleted successfully")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast.success("Logged out successfully")
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl py-10">
        <div className="flex w-full justify-start items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4 hover:ring-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
        </div>

        <div className="space-y-8">
          <Card className="border-blue-100 shadow-sm pt-0">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-white border-b pt-6">
              <CardTitle className="text-blue-600 ">Profile Information</CardTitle>
              <CardDescription>Manage your personal information and account settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                      <AvatarImage src={user.picture || "/placeholder.svg?height=128&width=128"} alt={user.name} />
                      <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-blue-500 hover:bg-blue-700 shadow-md"
                      onClick={() => setIsPictureDialogOpen(true)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-xs capitalize bg-blue-500"
                  >
                    {user.role?.replace("-", " ") || "User"}
                  </Badge>
                  <p className="text-sm text-center text-slate-600 max-w-[200px]">{profileData.bio}</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="border-blue-200 focus-visible:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={profileData.email} disabled className="bg-slate-50" />
                      <p className="text-xs text-muted-foreground mt-1">Contact support to change email</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Brief description for your profile</p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="bg-blue-50 border border-blue-100">
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Account
              </TabsTrigger>
              <TabsTrigger value="storage" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Storage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="mt-6 space-y-4">
              <Card className="border-blue-100 shadow-sm pt-0 mt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pt-6">
                  <CardTitle className="text-xl text-blue-800">Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button
                      onClick={() => setIsPasswordDialogOpen(true)}
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Key className="h-4 w-4 mr-2 text-blue-600" /> Change Password
                    </Button>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                      <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" /> Enable 2FA
                    </Button>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Recent Activity</h4>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                          <span className="text-sm">{activity.action}</span>
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-4">
              <Card className="border-blue-100 shadow-sm pt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pt-6">
                  <CardTitle className="text-xl text-blue-800">Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Notification Types</h4>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="content-approved">Content Approved</Label>
                          <p className="text-xs text-muted-foreground">Get notified when your content is approved</p>
                        </div>
                        <Switch
                          id="content-approved"
                          checked={notificationSettings.contentApproved}
                          disabled={!notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, contentApproved: checked })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="content-rejected">Content Rejected</Label>
                          <p className="text-xs text-muted-foreground">Get notified when your content is rejected</p>
                        </div>
                        <Switch
                          id="content-rejected"
                          checked={notificationSettings.contentRejected}
                          disabled={!notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, contentRejected: checked })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-uploads">New Uploads</Label>
                          <p className="text-xs text-muted-foreground">Get notified when new content is uploaded</p>
                        </div>
                        <Switch
                          id="new-uploads"
                          checked={notificationSettings.newUploads}
                          disabled={!notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, newUploads: checked })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-digest">Weekly Digest</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive a weekly summary of your channel activity
                          </p>
                        </div>
                        <Switch
                          id="weekly-digest"
                          checked={notificationSettings.weeklyDigest}
                          disabled={!notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={notificationSettings.marketingEmails}
                          disabled={!notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => toast.success("Notification settings saved")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6 space-y-4">
              <Card className="border-blue-100 shadow-sm pt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pt-6">
                  <CardTitle className="text-xl text-blue-800">Account Management</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Account Role</h4>
                      <p className="text-sm text-muted-foreground">
                        Your current role is{" "}
                        <span className="font-medium capitalize">{user.role?.replace("-", " ") || "User"}</span>
                      </p>
                    </div>
                    <Badge variant="default" className="capitalize bg-blue-600">
                      {user.role?.replace("-", " ") || "User"}
                    </Badge>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Connected Accounts</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Google</h4>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                        Connected
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                          <Youtube className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">YouTube</h4>
                          <p className="text-xs text-muted-foreground">Connect your YouTube channel</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Twitter className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Twitter</h4>
                          <p className="text-xs text-muted-foreground">Connect your Twitter account</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <Instagram className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Instagram</h4>
                          <p className="text-xs text-muted-foreground">Connect your Instagram account</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                        Connect
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-red-600">Danger Zone</h4>
                    <div className="p-4 border border-red-200 rounded-md bg-red-50">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Delete Account</h5>
                          <p className="text-xs text-muted-foreground">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive" size="sm" onClick={() => setIsDeleteAccountDialogOpen(true)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="pt-2">
                    <Button variant="outline" onClick={handleLogout} className="border-blue-200 hover:bg-blue-50">
                      <LogOut className="h-4 w-4 mr-2 text-blue-600" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="mt-6 space-y-4">
              <Card className="border-blue-100 shadow-sm pt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pt-6">
                  <CardTitle className="text-xl text-blue-800">Storage Usage</CardTitle>
                  <CardDescription>Manage your storage and data usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">Storage Used</h4>
                      <span className="text-sm font-medium">
                        {storageStats.used} GB of {storageStats.total} GB
                      </span>
                    </div>
                    <Progress
                      value={storageStats.percentage}
                      className="h-2 bg-blue-100"
                      indicatorClassName="bg-blue-600"
                    />
                    <p className="text-xs text-muted-foreground">
                      {storageStats.percentage}% of your storage has been used
                    </p>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Storage Breakdown</h4>

                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileEdit className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">Videos</h5>
                            <p className="text-xs text-muted-foreground">12 files</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">1.8 GB</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            {/* <Image src={null} className="h-4 w-4 text-green-600" /> */}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">Images</h5>
                            <p className="text-xs text-muted-foreground">48 files</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">0.6 GB</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Upload className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">Other Files</h5>
                            <p className="text-xs text-muted-foreground">23 files</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">0.3 GB</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-blue-100" />

                  <div className="flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                            Download All Data
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download all your uploaded content and data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button className="bg-blue-600 hover:bg-blue-700">Upgrade Storage</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Profile Picture Dialog */}
        <Dialog open={isPictureDialogOpen} onOpenChange={setIsPictureDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Change Profile Picture</DialogTitle>
              <DialogDescription>Upload a new profile picture</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={user.picture || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid w-full gap-2">
                  <Label htmlFor="picture">Upload Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground">Recommended: Square image, at least 300x300px</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPictureDialogOpen(false)}
                className="border-blue-200 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Profile picture updated")
                  setIsPictureDialogOpen(false)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Change Password</DialogTitle>
              <DialogDescription>Update your account password</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="border-blue-200 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">
                  All your data, including uploaded videos, settings, and account information will be permanently
                  deleted.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="delete-confirmation" className="text-red-600">
                  Please type DELETE to confirm
                </Label>
                <Input
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="border-red-200 focus-visible:ring-red-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteAccountDialogOpen(false)}
                className="border-blue-200 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirmation !== "DELETE"}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
