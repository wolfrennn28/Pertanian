import { getUserById } from './userService';
import { getLandBlockById } from './landBlockService';
import { createTask } from './taskService';
import type { Task, TaskType, TaskPriority, LandBlock } from '../types/database';

// n8n Webhook URL - Replace with your actual n8n webhook URL
export const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/task-notification';

// Notification payload types
export interface NotificationRecipient {
    userId: string;
    name: string;
    telegramChatId: string;
}

export interface TaskNotificationPayload {
    action: 'send_notification';
    sendNow: boolean;
    scheduledAt: string | null;
    task: {
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        deadline: string;
        landBlock: {
            id: string;
            name: string;
        } | null;
    };
    recipients: NotificationRecipient[];
}

/**
 * Build notification payload from task data
 */
export async function buildNotificationPayload(
    task: Task,
    assignedUserIds: string[],
    options: { sendNow: boolean; scheduledAt?: string }
): Promise<TaskNotificationPayload> {
    const recipients: NotificationRecipient[] = [];

    for (const userId of assignedUserIds) {
        const user = await getUserById(userId);
        if (user && user.telegram_chat_id) {
            recipients.push({
                userId: user.id,
                name: user.name,
                telegramChatId: user.telegram_chat_id,
            });
        }
    }

    let landBlock: LandBlock | null = null;
    if (task.land_block_id) {
        landBlock = await getLandBlockById(task.land_block_id);
    }

    return {
        action: 'send_notification',
        sendNow: options.sendNow,
        scheduledAt: options.scheduledAt || null,
        task: {
            id: task.id,
            title: task.title,
            description: task.description || '',
            type: task.type,
            priority: task.priority,
            deadline: task.deadline,
            landBlock: landBlock ? { id: landBlock.id, name: landBlock.name } : null,
        },
        recipients,
    };
}

/**
 * Send task notification via n8n webhook
 */
export async function sendTaskNotification(
    payload: TaskNotificationPayload
): Promise<{ success: boolean; message: string }> {
    try {
        // Log payload for debugging (in real app, this would be the actual fetch call)
        console.log('📤 Sending notification to n8n webhook:', N8N_WEBHOOK_URL);
        console.log('📋 Payload:', JSON.stringify(payload, null, 2));

        // Simulate API call - Replace with actual fetch in production
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // For demo purposes, we'll simulate success even if the webhook URL is placeholder
        if (!response.ok && N8N_WEBHOOK_URL.includes('your-n8n-instance')) {
            console.log('⚠️ Using placeholder webhook URL - simulating success');
            return {
                success: true,
                message: payload.sendNow
                    ? 'Notifikasi berhasil dikirim (simulasi)'
                    : `Notifikasi dijadwalkan untuk ${payload.scheduledAt} (simulasi)`,
            };
        }

        return {
            success: true,
            message: payload.sendNow
                ? 'Notifikasi berhasil dikirim ke Telegram'
                : `Notifikasi dijadwalkan untuk ${payload.scheduledAt}`,
        };
    } catch (error) {
        console.error('❌ Error sending notification:', error);

        // For demo with placeholder URL, still return success
        if (N8N_WEBHOOK_URL.includes('your-n8n-instance')) {
            console.log('⚠️ Using placeholder webhook URL - simulating success despite error');
            return {
                success: true,
                message: payload.sendNow
                    ? 'Notifikasi berhasil dikirim (simulasi)'
                    : `Notifikasi dijadwalkan untuk ${payload.scheduledAt} (simulasi)`,
            };
        }

        return {
            success: false,
            message: 'Gagal mengirim notifikasi. Silakan coba lagi.',
        };
    }
}

interface CreateTaskInput {
    title: string;
    description?: string;
    type: TaskType;
    priority: TaskPriority;
    deadline: string;
    landBlockId: string;
    assignedTo: string[];
    createdBy?: string;
}

/**
 * Create task and send notification
 */
export async function createTaskWithNotification(
    taskData: CreateTaskInput,
    notificationOptions: {
        sendNotification: boolean;
        sendNow: boolean;
        scheduledAt?: string;
    }
): Promise<{ task: Task; notificationResult?: { success: boolean; message: string } }> {
    // Create task in Supabase
    const newTask = await createTask({
        title: taskData.title,
        description: taskData.description || null,
        type: taskData.type,
        priority: taskData.priority,
        deadline: taskData.deadline,
        land_block_id: taskData.landBlockId || null,
        assigned_to: taskData.assignedTo,
        created_by: taskData.createdBy || null,
    });

    if (!newTask) {
        throw new Error('Failed to create task');
    }

    // If notification is enabled, send it
    if (notificationOptions.sendNotification) {
        const payload = await buildNotificationPayload(newTask, taskData.assignedTo, {
            sendNow: notificationOptions.sendNow,
            scheduledAt: notificationOptions.scheduledAt,
        });

        const notificationResult = await sendTaskNotification(payload);

        return { task: newTask, notificationResult };
    }

    return { task: newTask };
}
