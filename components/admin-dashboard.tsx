'use client';

import { useState, useEffect, useMemo } from 'react';
import { Todo, UserProfile } from '@/lib/types';
import * as api from '@/lib/mock-api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
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
import { AdminTaskForm } from '@/components/admin-task-form';
import { AssignTaskDialog } from '@/components/assign-task-dialog';
import { TaskSearch, SearchFilters } from './task-search';
import { format } from 'date-fns';

export function AdminDashboard() {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTodos = async () => {
    try {
      const data = await api.fetchAllTodos();
      setAllTodos(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load todos',
        variant: 'destructive',
      });
    }
  };
  
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const loadUsers = async () => {
    try {
      const data = await api.fetchAllUsers();
      // Filter out admin users
      const regularUsers = data.filter(user => user.role === 'user');
      setUsers(regularUsers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTodo = async (data: Omit<Todo, 'id'>) => {
    try {
      await api.createTodo(data);
      await loadTodos();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Todo created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create todo',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTodo = async (data: Partial<Todo>) => {
    if (!editingTodo) return;
    try {
      await api.updateTodo(editingTodo.id, data);
      await loadTodos();
      setEditingTodo(null);
      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setAllTodos(allTodos.filter((todo: Todo) => todo.id !== id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
    }
  };

  const handleAssignTask = async (userId: string) => {
    if (!selectedTodo) return;
    
    try {
      await api.updateTodo(selectedTodo.id, { userId });
      await loadTodos();
      setIsAssignDialogOpen(false);
      setSelectedTodo(null);
      toast({
        title: 'Success',
        description: 'Task assigned successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign task',
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

  const getAssignedUser = (userId?: string) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="btn-purple"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <TaskSearch onSearch={handleSearch} />
      
      {filteredTodos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-md">
          <h3 className="text-xl font-semibold mb-2">No matching tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      )}

      <Table>
        <TableCaption>List of all tasks in the system</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTodos.map((todo, index) => (
            <TableRow key={todo.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{todo.title}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(todo.priority)}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{todo.category}</TableCell>
              <TableCell>{new Date(todo.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={todo.active ? "outline" : "default"}>
                  {todo.active ? 'Pending' : 'Completed'}
                </Badge>
              </TableCell>
              <TableCell>{getAssignedUser(todo.userId)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setEditingTodo(todo);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setEditingTodo(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <AdminTaskForm
            initialData={editingTodo || undefined}
            onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AssignTaskDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        users={users}
        selectedTask={selectedTodo}
        onAssign={handleAssignTask}
      />
    </div>
  );
}
