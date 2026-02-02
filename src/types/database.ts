// Database Types for Supabase

export type UserRole = 'admin' | 'farmer';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskType = 'planting' | 'watering' | 'harvesting' | 'monitoring' | 'fertilizing' | 'pest_control';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LandBlockStatus = 'active' | 'fallow' | 'harvesting' | 'preparation';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string | null;
    avatar: string | null;
    telegram_chat_id: string | null;
    assigned_blocks: string[] | null;
    created_at: string;
}

export interface LandBlock {
    id: string;
    name: string;
    lat: number;
    lng: number;
    area: number;
    crop_type: string;
    status: LandBlockStatus;
    assigned_farmers: string[] | null;
    last_updated: string;
    soil_type: string | null;
    irrigation_type: string | null;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    type: TaskType;
    priority: TaskPriority;
    deadline: string;
    assigned_to: string[] | null;
    land_block_id: string | null;
    created_by: string | null;
    created_at: string;
    completed_at: string | null;
    notes: string | null;
}

export interface Report {
    id: string;
    task_id: string | null;
    user_id: string | null;
    land_block_id: string | null;
    content: string;
    images: string[] | null;
    created_at: string;
    weather_condition: string | null;
    issues: string[] | null;
}

// Insert types (fields with defaults can be optional)
export type UserInsert = {
    name: string;
    email: string;
    role?: UserRole;
    phone?: string | null;
    avatar?: string | null;
    telegram_chat_id?: string | null;
    assigned_blocks?: string[] | null;
};

export type LandBlockInsert = {
    name: string;
    lat: number;
    lng: number;
    area: number;
    crop_type: string;
    status?: LandBlockStatus;
    assigned_farmers?: string[] | null;
    soil_type?: string | null;
    irrigation_type?: string | null;
};

export type TaskInsert = {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    type: TaskType;
    priority?: TaskPriority;
    deadline: string;
    assigned_to?: string[] | null;
    land_block_id?: string | null;
    created_by?: string | null;
    notes?: string | null;
};

export type ReportInsert = {
    task_id?: string | null;
    user_id?: string | null;
    land_block_id?: string | null;
    content: string;
    images?: string[] | null;
    weather_condition?: string | null;
    issues?: string[] | null;
};

// Weekly Monitoring for plant growth
export interface WeeklyMonitoring {
    id: string;
    land_block_id: string | null;
    recorded_by: string | null;
    recorded_at: string;
    week_number: number;
    tinggi_tanaman: number | null; // Plant height (cm)
    jumlah_anakan: number | null; // Number of tillers
    jumlah_daun: number | null; // Number of leaves
    jumlah_anakan_produktif: number | null; // Productive tillers
    notes: string | null;
    created_at: string;
}

export type WeeklyMonitoringInsert = {
    land_block_id: string;
    recorded_by?: string | null;
    week_number: number;
    tinggi_tanaman?: number | null;
    jumlah_anakan?: number | null;
    jumlah_daun?: number | null;
    jumlah_anakan_produktif?: number | null;
    notes?: string | null;
};

// Harvest Parameters (18 fields)
export interface HarvestParameters {
    id: string;
    land_block_id: string | null;
    recorded_by: string | null;
    recorded_at: string;
    berat_1000_butir: number | null; // Weight of 1000 grains (gram)
    jumlah_bulir_per_malai: number | null;
    gabah_beras_per_malai: number | null;
    gabah_kering_panen: number | null;
    brangkasan_segar: number | null;
    brangkasan_kering: number | null;
    kadar_air_panen: number | null;
    warna_gabah: string | null;
    kerontokan: string | null;
    kerebahan: string | null;
    texture_nasi: string | null;
    kadar_amilosa: number | null;
    indeks_glikemik: number | null;
    rata_rata_hasil: number | null;
    ketahanan_hama: string | null;
    ketahanan_penyakit: string | null;
    potensi_hasil: number | null;
    bentuk_gabah: string | null;
    notes: string | null;
    created_at: string;
}

export type HarvestParametersInsert = {
    land_block_id: string;
    recorded_by?: string | null;
    berat_1000_butir?: number | null;
    jumlah_bulir_per_malai?: number | null;
    gabah_beras_per_malai?: number | null;
    gabah_kering_panen?: number | null;
    brangkasan_segar?: number | null;
    brangkasan_kering?: number | null;
    kadar_air_panen?: number | null;
    warna_gabah?: string | null;
    kerontokan?: string | null;
    kerebahan?: string | null;
    texture_nasi?: string | null;
    kadar_amilosa?: number | null;
    indeks_glikemik?: number | null;
    rata_rata_hasil?: number | null;
    ketahanan_hama?: string | null;
    ketahanan_penyakit?: string | null;
    potensi_hasil?: number | null;
    bentuk_gabah?: string | null;
    notes?: string | null;
};

// Insect Monitoring
export interface InsectMonitoring {
    id: string;
    land_block_id: string | null;
    recorded_by: string | null;
    recorded_at: string;
    week_number: number;
    intensitas_serangan: number | null; // Attack intensity (%)
    serangga_ditemukan: string[] | null; // Insects found
    penyakit_ditemukan: string[] | null; // Diseases found
    notes: string | null;
    created_at: string;
}

export type InsectMonitoringInsert = {
    land_block_id: string;
    recorded_by?: string | null;
    week_number: number;
    intensitas_serangan?: number | null;
    serangga_ditemukan?: string[] | null;
    penyakit_ditemukan?: string[] | null;
    notes?: string | null;
};

// Database schema type for Supabase client
export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: UserInsert;
                Update: Partial<UserInsert>;
            };
            land_blocks: {
                Row: LandBlock;
                Insert: LandBlockInsert;
                Update: Partial<LandBlockInsert>;
            };
            tasks: {
                Row: Task;
                Insert: TaskInsert;
                Update: Partial<TaskInsert>;
            };
            reports: {
                Row: Report;
                Insert: ReportInsert;
                Update: Partial<ReportInsert>;
            };
            weekly_monitoring: {
                Row: WeeklyMonitoring;
                Insert: WeeklyMonitoringInsert;
                Update: Partial<WeeklyMonitoringInsert>;
            };
            harvest_parameters: {
                Row: HarvestParameters;
                Insert: HarvestParametersInsert;
                Update: Partial<HarvestParametersInsert>;
            };
            insect_monitoring: {
                Row: InsectMonitoring;
                Insert: InsectMonitoringInsert;
                Update: Partial<InsectMonitoringInsert>;
            };
        };
    };
}

