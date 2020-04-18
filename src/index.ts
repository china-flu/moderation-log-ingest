import { RedditLogIngestWorkflow } from "./workflow/RedditLogIngestWorkflow";
import { RepositoryRegistry } from "./repository/RepositoryRegistry";
import { PostgresDriver } from "./services/PostgresDriver";
import { RedditService } from "./services/RedditService";

async function runWorkflow() {
  let postgresDriver: PostgresDriver | null = null;

  try {
    postgresDriver = new PostgresDriver();
    await postgresDriver.start();

    const repositoryRegistry = new RepositoryRegistry(postgresDriver);
    const redditService = new RedditService();

    const workflow = new RedditLogIngestWorkflow({ repositoryRegistry, redditService });
    await workflow.ingestLogs();
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
  finally {
    if (postgresDriver) await postgresDriver.stop();
  }
}

setImmediate(async () => await runWorkflow());
