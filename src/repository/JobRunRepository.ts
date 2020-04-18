import { Repository } from "./Repository";

export class JobRunRepository extends Repository {
  public async create({ reference_uuid, last_inserted_log_id, started_at}: { reference_uuid: string, last_inserted_log_id: number; started_at: number }): Promise<number> {
    const statement = "INSERT INTO job_runs (reference_uuid, last_inserted_log_id, started_at, completed_at) VALUES ($1, $2, timezone('utc',to_timestamp($3)), timezone('utc', now())) RETURNING job_run_id";
    const values = [reference_uuid, last_inserted_log_id, started_at];
    const result = await this.postgresDriver.query(statement, values);
    return result.rows[0]["job_run_id"]
  }
}
