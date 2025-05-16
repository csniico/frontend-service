'use client';

import { useState, useEffect, useMemo } from 'react';
import { Todo } from '@/lib/types';
import * as api from '@/lib/mock-api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, PenSquare } from 'lucide-react';
import { StatusChangeDialog } from './status-change-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskSearch, SearchFilters } from './task-search';
import { format } from 'date-fns';

export function UserDashboard() {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [newStatus, setNewStatus] = useState<'pending' | 'in-progress' | 'completed' | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTodos = async () => {
    try {
      const data = await api.fetchTodos();
      setAllTodos(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    }
  };
  
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  type TaskStatus = 'pending' | 'in-progress' | 'completed';

  const openStatusChangeDialog = (task: Todo, status: TaskStatus) => {
    setSelectedTask(task);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask || !newStatus) return;
    
    try {
      // For 'completed' status, set active to false, otherwise true
      const active = newStatus !== 'completed';
      
      await api.updateTodo(selectedTask.id, { 
        active,
        status: newStatus 
      });
      
      await loadTodos();
      
      toast({
        title: 'Status Updated',
        description: `Task status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter todos based on search criteria
  const filteredTodos = useMemo(() => {
    return allTodos.filter(todo => {
      // Title filter
      if (searchFilters.title && !todo.title.toLowerCase().includes(searchFilters.title.toLowerCase())) {
        return false;
      }
      
      // Priority filter
      if (searchFilters.priority && todo.priority !== searchFilters.priority) {
        return false;
      }
      
      // Category filter
      if (searchFilters.category && !todo.category.toLowerCase().includes(searchFilters.category.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (searchFilters.status) {
        if (searchFilters.status === 'completed' && todo.active) {
          return false;
        } else if (searchFilters.status === 'pending' && (!todo.active || todo.status === 'in-progress')) {
          return false;
        } else if (searchFilters.status === 'in-progress' && todo.status !== 'in-progress') {
          return false;
        }
      }
      
      // Date filter
      if (searchFilters.date) {
        const todoDate = new Date(todo.date);
        const filterDate = new Date(searchFilters.date);
        
        if (
          todoDate.getFullYear() !== filterDate.getFullYear() ||
          todoDate.getMonth() !== filterDate.getMonth() ||
          todoDate.getDate() !== filterDate.getDate()
        ) {
          return false;
        }
      }
      
      return true;
    });
  }, [allTodos, searchFilters]);

  if (allTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No Tasks Assigned</h2>
        <p className="text-muted-foreground">You don't have any tasks assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskSearch onSearch={handleSearch} />
      
      {filteredTodos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-md">
          <h3 className="text-xl font-semibold mb-2">No matching tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      )}

      <Table>
        <TableCaption>Your assigned tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Change Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo, index) => (
            <TableRow key={todo.id} className={!todo.active ? "opacity-60" : ""}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{todo.title}</TableCell>
              <TableCell className="max-w-xs truncate">{todo.description}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(todo.priority)}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{todo.category}</TableCell>
              <TableCell>{new Date(todo.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge 
                  className={`${todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                    todo.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {todo.status === 'in-progress' ? 'In Progress' : 
                   todo.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  onValueChange={(value: TaskStatus) => openStatusChangeDialog(todo, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Status Change Confirmation Dialog */}
      <StatusChangeDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        task={selectedTask}
        newStatus={newStatus}
        onConfirm={handleUpdateStatus}
      />
    </div>
  );
}
