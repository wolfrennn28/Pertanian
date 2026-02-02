import { supabase } from '../lib/supabase';
import type { Report, ReportInsert } from '../types/database';

export async function getReports(): Promise<Report[]> {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
    return data || [];
}

export async function getReportsByTask(taskId: string): Promise<Report[]> {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports by task:', error);
        return [];
    }
    return data || [];
}

export async function getReportsByUser(userId: string): Promise<Report[]> {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports by user:', error);
        return [];
    }
    return data || [];
}

export async function createReport(report: ReportInsert): Promise<Report | null> {
    const { data, error } = await supabase
        .from('reports')
        .insert(report)
        .select()
        .single();

    if (error) {
        console.error('Error creating report:', error);
        return null;
    }
    return data;
}
