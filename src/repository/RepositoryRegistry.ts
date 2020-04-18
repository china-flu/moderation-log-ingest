import { PostgresDriver } from "../services/PostgresDriver";

import { UserRepository } from "./UserRepository";
import { JobRunRepository } from "./JobRunRepository";
import { ModerationLogRepository } from "./ModerationLogRepository";

export class RepositoryRegistry {
  public readonly userRepository: UserRepository;
  public readonly jobRunRepository: JobRunRepository;
  public readonly moderationLogRepository: ModerationLogRepository;

  constructor(postgresDriver: PostgresDriver) {
    this.userRepository = new UserRepository(postgresDriver);
    this.jobRunRepository = new JobRunRepository(postgresDriver);
    this.moderationLogRepository = new ModerationLogRepository(postgresDriver);
  }
}
