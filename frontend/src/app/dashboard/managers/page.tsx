/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { History, Loader2, Mail, Plus, UserX } from "lucide-react";
import { getManagers } from "@/lib/api";

export default function ContentManagersPage() {
  const [managers, setManagers] = useState<any[]>([]);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [isAddManagerDialogOpen, setIsAddManagerDialogOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "" });
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchManagers = async () => {
      setIsLoading(true);
      try {
        const data = await getManagers();
        if (data && Array.isArray(data)) {
          setManagers(data);
        } else {
          setManagers([]); 
          toast.error("Failed to fetch managers: Unexpected response format.");
        }
      } catch (error) {
        console.error("Failed to fetch managers:", error);
        toast.error("Failed to fetch managers. Please try again later.");
        setManagers([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const handleRevokeAccess = () => {
    setManagers(managers.filter((manager) => manager.id !== selectedManager.id));
    setIsRevokeDialogOpen(false);
    setSelectedManager(null);
    toast.success("Manager removed");
  };

  const handleAddManager = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newManager.name || !newManager.email) {
      toast.error("Please fill in all fields");
      return;
    } else if (!emailRegex.test(newManager.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setEmailLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
    setIsAddManagerDialogOpen(false);
    setNewManager({ name: "", email: "" });    
    toast.success("Invite sent successfully!");
    setEmailLoading(false);
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="border border-border shadow-md rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Content Managers</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your content managers
            </CardDescription>
          </div>
          <Button className="bg-blue-600" onClick={() => setIsAddManagerDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Manager
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">History</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.length > 0 ? (
              managers.map((manager) => (
                  <TableRow key={manager._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell className="text-center">
                      <Link href="/log">
                        <Button className="" variant="ghost"> <History className="h-4 w-4" /></Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-500"
                        onClick={() => {
                          setSelectedManager(manager);
                          setIsRevokeDialogOpen(true);
                        }}
                      >
                        <UserX className="mr-1 h-4 w-4" /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No content managers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Manager</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedManager?.name}? They will be notified through email. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAccess}>
              Remove Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddManagerDialogOpen} onOpenChange={setIsAddManagerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Manager</DialogTitle>
            <DialogDescription>Invite someone to join your team. They will be notified through email.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newManager.email}
                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddManagerDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={'ghost'} className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white" onClick={handleAddManager}>
              {emailLoading? <Loader2 className="animate-spin h-5 w-5"/>  :"Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
