import Snoowrap from "snoowrap";

const { REDDIT_USERNAME, REDDIT_PASSWORD, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } = process.env;

export class RedditService {
  public readonly redditInstance: Snoowrap;

  constructor() {
    this.redditInstance = new Snoowrap({
      userAgent: "ModLog Ingest 1.0",
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
      clientId: REDDIT_CLIENT_ID,
      clientSecret: REDDIT_CLIENT_SECRET
    });
  }
}
