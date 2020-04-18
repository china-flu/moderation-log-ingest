import { RedditService } from "../../services/RedditService";
import { RepositoryRegistry } from "../../repository/RepositoryRegistry";

export interface WorkflowDependencies {
  repositoryRegistry: RepositoryRegistry;
  redditService: RedditService;
}
