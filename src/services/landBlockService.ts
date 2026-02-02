import { supabase } from '../lib/supabase';
import type { LandBlock, LandBlockInsert } from '../types/database';

export async function getLandBlocks(): Promise<LandBlock[]> {
    const { data, error } = await supabase
        .from('land_blocks')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching land blocks:', error);
        return [];
    }
    return data || [];
}

export async function getLandBlockById(id: string): Promise<LandBlock | null> {
    const { data, error } = await supabase
        .from('land_blocks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching land block:', error);
        return null;
    }
    return data;
}

export async function getLandBlocksByFarmer(userId: string): Promise<LandBlock[]> {
    const { data, error } = await supabase
        .from('land_blocks')
        .select('*')
        .contains('assigned_farmers', [userId])
        .order('name');

    if (error) {
        console.error('Error fetching land blocks by farmer:', error);
        return [];
    }
    return data || [];
}

export async function createLandBlock(landBlock: LandBlockInsert): Promise<LandBlock | null> {
    const { data, error } = await supabase
        .from('land_blocks')
        .insert(landBlock)
        .select()
        .single();

    if (error) {
        console.error('Error creating land block:', error);
        return null;
    }
    return data;
}

export async function updateLandBlock(id: string, updates: Partial<LandBlockInsert>): Promise<LandBlock | null> {
    const { data, error } = await supabase
        .from('land_blocks')
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating land block:', error);
        return null;
    }
    return data;
}
