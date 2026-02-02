import { supabase } from '../lib/supabase';
import type { WeeklyMonitoring, WeeklyMonitoringInsert, InsectMonitoring, InsectMonitoringInsert } from '../types/database';

// ====== Weekly Monitoring ======

export async function getWeeklyMonitoring(): Promise<WeeklyMonitoring[]> {
    const { data, error } = await supabase
        .from('weekly_monitoring')
        .select('*')
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error fetching weekly monitoring:', error);
        return [];
    }
    return data || [];
}

export async function getWeeklyMonitoringByLandBlock(landBlockId: string): Promise<WeeklyMonitoring[]> {
    const { data, error } = await supabase
        .from('weekly_monitoring')
        .select('*')
        .eq('land_block_id', landBlockId)
        .order('week_number', { ascending: false });

    if (error) {
        console.error('Error fetching weekly monitoring by land block:', error);
        return [];
    }
    return data || [];
}

export async function createWeeklyMonitoring(monitoring: WeeklyMonitoringInsert): Promise<WeeklyMonitoring | null> {
    const { data, error } = await supabase
        .from('weekly_monitoring')
        .insert(monitoring)
        .select()
        .single();

    if (error) {
        console.error('Error creating weekly monitoring:', error);
        return null;
    }
    return data;
}

// ====== Insect Monitoring ======

export async function getInsectMonitoring(): Promise<InsectMonitoring[]> {
    const { data, error } = await supabase
        .from('insect_monitoring')
        .select('*')
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error fetching insect monitoring:', error);
        return [];
    }
    return data || [];
}

export async function getInsectMonitoringByLandBlock(landBlockId: string): Promise<InsectMonitoring[]> {
    const { data, error } = await supabase
        .from('insect_monitoring')
        .select('*')
        .eq('land_block_id', landBlockId)
        .order('week_number', { ascending: false });

    if (error) {
        console.error('Error fetching insect monitoring by land block:', error);
        return [];
    }
    return data || [];
}

export async function createInsectMonitoring(monitoring: InsectMonitoringInsert): Promise<InsectMonitoring | null> {
    const { data, error } = await supabase
        .from('insect_monitoring')
        .insert(monitoring)
        .select()
        .single();

    if (error) {
        console.error('Error creating insect monitoring:', error);
        return null;
    }
    return data;
}
