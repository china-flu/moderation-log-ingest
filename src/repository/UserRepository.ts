import { Repository } from "./Repository";

export class UserRepository extends Repository {
  public async getCoalescedUserId(username?: string): Promise<number|undefined> {
    if (!username) return undefined;

    const fetchStatement = "SELECT * FROM users WHERE username = $1";
    const fetchResult = await this.postgresDriver.query(fetchStatement, [username]);
    if (fetchResult.rowCount > 0) return fetchResult.rows[0]["user_id"];

    const insertStatement = "INSERT INTO users (username, created_at) VALUES ($1, timezone('utc', now())) RETURNING user_id";
    const insertResult = await this.postgresDriver.query(insertStatement, [username]);
    return insertResult.rows[0]["user_id"];
  }
}
