import uuid from "uuid/v4";

import { WorkflowDependencies } from "../definitions/dependencies/WorkflowDependencies";
import { ModerationLogCreatorPayload } from "../definitions/entities/ModerationLog";

const { SUB_REDDIT } = process.env;

export class RedditLogIngestWorkflow {
  private readonly dependencies: WorkflowDependencies;

  constructor(dependencies: WorkflowDependencies) {
    this.dependencies = dependencies;
  }

  private getLinkType(link?: string): string | null {
    if (!link) return null;
    return link.split("/").length === 8 ? "comment" : "post";
  }

  public async ingestLogs(): Promise<void> {
    const jobStartEpoch = Date.now();
    console.log("Ingest beginning");

    const { repositoryRegistry: { moderationLogRepository, userRepository, jobRunRepository }, redditService: { redditInstance } } = this.dependencies;
    const lastLog = await moderationLogRepository.getMostRecentLogByJob();
    if (!lastLog) throw Error("No last job");

    const subReddit = redditInstance.getSubreddit(SUB_REDDIT!);

    console.log("Loading the newest logs");
    let logs = await subReddit.getModerationLog();
    while (!logs.find(log => log.id === lastLog.action_uuid)) {
      logs = await logs.fetchMore({ append: true, amount: 550 });
      console.log(`Still loading ${logs.length}`);
    }

    console.log(`Found ${logs.length} logs, finding the last log we saw...`);
    const lastLogResultSetIdx = logs.findIndex(log => log.id === lastLog.action_uuid);

    if (lastLogResultSetIdx < 2) {
      console.log("No new logs right now");
      return;
    }

    console.log(`${logs.length - lastLogResultSetIdx} extra fetched...`);

    const logsToIngest = logs.slice(0, lastLogResultSetIdx - 1).reverse();
    console.log(`${logsToIngest.length} being ingested...`);

    let lastIngestedLogId: number;
    for (let i = 0; i < logsToIngest.length; i++) {
      const log = logsToIngest[i];
      const affectedUserId = await userRepository.getCoalescedUserId(log.target_author);
      const moderatorUserId = await userRepository.getCoalescedUserId(log.mod);

      const payload: ModerationLogCreatorPayload = {
        affected_user_id: affectedUserId,
        moderator_user_id: moderatorUserId!,
        description: log.description || null,
        affected_body: log.target_body || null,
        action_details: log.details,
        action_uuid: log.id,
        log_timestamp: log.created_utc,
        action: log.action,
        permalink: log.target_permalink,
        permalink_type: this.getLinkType(log.target_permalink)
      };

      console.log(`Inserting ${payload.action_uuid}`);
      lastIngestedLogId = await moderationLogRepository.create(payload);
    }
    console.log("Marking job as complete");
    await jobRunRepository.create({ reference_uuid: uuid(), started_at: jobStartEpoch, last_inserted_log_id: lastIngestedLogId! });
  }
}
