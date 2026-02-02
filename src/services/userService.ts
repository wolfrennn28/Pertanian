import { supabase } from '../lib/supabase';
import type { User, UserInsert } from '../types/database';

export async function getUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }
    return data || [];
}

export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }
    return data;
}

export async function getFarmers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'farmer')
        .order('name');

    if (error) {
        console.error('Error fetching farmers:', error);
        return [];
    }
    return data || [];
}

export async function getAdmins(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .order('name');

    if (error) {
        console.error('Error fetching admins:', error);
        return [];
    }
    return data || [];
}

export async function createUser(user: UserInsert): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        return null;
    }
    return data;
}

export async function updateUser(id: string, updates: Partial<UserInsert>): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating user:', error);
        return null;
    }
    return data;
}
