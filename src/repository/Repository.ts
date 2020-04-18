import { PostgresDriver } from "../services/PostgresDriver";

export class Repository {
  protected readonly postgresDriver: PostgresDriver;

  public constructor(postgresDriver: PostgresDriver) {
    this.postgresDriver = postgresDriver;
  }
}
