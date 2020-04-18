import { Repository } from "./Repository";
import { ModerationLog, ModerationLogCreatorPayload } from "../definitions/entities/ModerationLog";

export class ModerationLogRepository extends Repository {
  public async getMostRecentLogByJob(): Promise<ModerationLog|null> {
    const statement = "SELECT ml.* FROM job_runs jr INNER JOIN moderation_logs ml on jr.last_inserted_log_id = ml.moderation_log_id " +
      "ORDER BY jr.job_run_id DESC LIMIT 1";
    const result = await this.postgresDriver.query(statement);
    return result.rowCount > 0 ? result.rows[0] : null;
  }

  public async create({ affected_user_id, moderator_user_id, description, affected_body, action_uuid, action, action_details, permalink, permalink_type, log_timestamp }: ModerationLogCreatorPayload): Promise<number> {
    const statement = "INSERT INTO moderation_logs (affected_user_id, moderator_user_id, description, affected_body, action_uuid, action, action_details, permalink, permalink_type, log_timestamp, created_at) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, timezone('utc',to_timestamp($10)), timezone('utc', now())) RETURNING moderation_log_id; ";
    const values = [affected_user_id || null, moderator_user_id, description, affected_body, action_uuid, action, action_details || null, permalink || null, permalink_type || null, log_timestamp];
    const result = await this.postgresDriver.query(statement, values);
    return result.rows[0]["moderation_log_id"];
  }
}
