'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserProfile, Todo } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserProfile[];
  selectedTask: Todo | null;
  onAssign: (userId: string) => void;
}

export function AssignTaskDialog({
  open,
  onOpenChange,
  users,
  selectedTask,
  onAssign,
}: AssignTaskDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(selectedTask?.userId || '');

  const handleAssign = () => {
    if (selectedUserId) {
      onAssign(selectedUserId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedTask && (
            <div className="grid gap-2">
              <Label htmlFor="task-title" className="font-medium">
                Task
              </Label>
              <div id="task-title" className="text-sm">
                {selectedTask.title}
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="user" className="font-medium">
              Assign to User
            </Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} className="btn-purple">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
