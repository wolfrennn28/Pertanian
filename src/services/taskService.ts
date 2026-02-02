import { supabase } from '../lib/supabase';
import type { Task, TaskStatus, TaskInsert } from '../types/database';

export async function getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('deadline');

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data || [];
}

export async function getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching task:', error);
        return null;
    }
    return data;
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .contains('assigned_to', [userId])
        .order('deadline');

    if (error) {
        console.error('Error fetching tasks by user:', error);
        return [];
    }
    return data || [];
}

export async function getTasksByLandBlock(landBlockId: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('land_block_id', landBlockId)
        .order('deadline');

    if (error) {
        console.error('Error fetching tasks by land block:', error);
        return [];
    }
    return data || [];
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', status)
        .order('deadline');

    if (error) {
        console.error('Error fetching tasks by status:', error);
        return [];
    }
    return data || [];
}

export async function createTask(task: TaskInsert): Promise<Task | null> {
    const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

    if (error) {
        console.error('Error creating task:', error);
        return null;
    }
    return data;
}

export async function updateTask(id: string, updates: Partial<TaskInsert>): Promise<Task | null> {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating task:', error);
        return null;
    }
    return data;
}

export async function deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        return false;
    }
    return true;
}

// Statistics
export interface TaskStats {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

export async function getTaskStats(): Promise<TaskStats> {
    const { data, error } = await supabase
        .from('tasks')
        .select('status');

    if (error) {
        console.error('Error fetching task stats:', error);
        return {
            totalTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
        };
    }

    const tasks = data || [];
    return {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        overdueTasks: tasks.filter(t => t.status === 'overdue').length,
    };
}
