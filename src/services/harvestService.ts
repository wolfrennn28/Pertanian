import { supabase } from '../lib/supabase';
import type { HarvestParameters, HarvestParametersInsert } from '../types/database';

export async function getHarvestParameters(): Promise<HarvestParameters[]> {
    const { data, error } = await supabase
        .from('harvest_parameters')
        .select('*')
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error fetching harvest parameters:', error);
        return [];
    }
    return data || [];
}

export async function getHarvestParametersByLandBlock(landBlockId: string): Promise<HarvestParameters[]> {
    const { data, error } = await supabase
        .from('harvest_parameters')
        .select('*')
        .eq('land_block_id', landBlockId)
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error fetching harvest parameters by land block:', error);
        return [];
    }
    return data || [];
}

export async function createHarvestParameters(params: HarvestParametersInsert): Promise<HarvestParameters | null> {
    const { data, error } = await supabase
        .from('harvest_parameters')
        .insert(params)
        .select()
        .single();

    if (error) {
        console.error('Error creating harvest parameters:', error);
        return null;
    }
    return data;
}

export async function updateHarvestParameters(id: string, params: Partial<HarvestParametersInsert>): Promise<HarvestParameters | null> {
    const { data, error } = await supabase
        .from('harvest_parameters')
        .update(params)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating harvest parameters:', error);
        return null;
    }
    return data;
}
