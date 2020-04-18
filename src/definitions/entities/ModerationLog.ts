export interface ModerationLog {
  moderation_log_id: number;
  affected_user_id?: number;
  moderator_user_id: number;
  affected_body: string | null;
  description?: string;
  action_uuid: string;
  action: string;
  action_details?: string;
  permalink?: string;
  permalink_type?: string;
  log_timestamp: any;
  created_at: any;
}

export interface ModerationLogCreatorPayload {
  affected_user_id?: number;
  moderator_user_id: number;
  description: string | null;
  affected_body: string | null;
  action_uuid: string;
  action: string;
  action_details: string | null;
  permalink: string | null;
  permalink_type: string | null;
  log_timestamp: number;
}
