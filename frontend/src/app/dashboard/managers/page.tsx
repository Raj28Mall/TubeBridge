"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for content managers
const initialManagers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
  },
];

export default function ContentManagersPage() {
  const [managers, setManagers] = useState(initialManagers);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [isAddManagerDialogOpen, setIsAddManagerDialogOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "" });

  const handleRevokeAccess = () => {
    setManagers(managers.filter((manager) => manager.id !== selectedManager.id))
    setIsRevokeDialogOpen(false)
  }

  const handleAddManager = () => {
    const newId = Math.max(...managers.map((m) => m.id)) + 1
    setManagers([...managers, { id: newId, ...newManager }])
    setNewManager({ name: "", email: "" })
    setIsAddManagerDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between w-[40vw]">
          <div>
            <CardTitle>Content Managers</CardTitle>
            <CardDescription>Manage your content managers</CardDescription>
          </div>
          <Button onClick={() => setIsAddManagerDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Manager
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="pl-6">Status</TableHead>
                <TableHead className="pl-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {managers.map((manager) => (
                <TableRow key={manager.id} className="">
                  <TableCell className="font-medium">{manager.name}</TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>
                    <Link href='/log'>
                      <Button variant={"ghost"}>
                       📝 History
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="">
                    <Button variant="ghost" className="text-red-600">
                        <UserX className="mr-1 h-4 w-4" />
                        Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revoke Access Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Manager</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedManager?.name}? This action cannot be undone.
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

      {/* Add Manager Dialog */}
      <Dialog open={isAddManagerDialogOpen} onOpenChange={setIsAddManagerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Manager</DialogTitle>
            <DialogDescription>Add a new content manager to your team</DialogDescription>
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
            <Button onClick={handleAddManager}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

