'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Todo } from '@/lib/types';

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Todo | null;
  newStatus: 'pending' | 'in-progress' | 'completed' | null;
  onConfirm: () => void;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  task,
  newStatus,
  onConfirm,
}: StatusChangeDialogProps) {
  if (!task || !newStatus) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      default:
        return '';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            Are you sure you want to change the status of task <span className="font-semibold">"{task.title}"</span> to:
          </p>
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-md">
            <span className={`text-lg font-medium ${getStatusColor(newStatus)}`}>
              {formatStatus(newStatus)}
            </span>
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="btn-purple"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
