import { Injectable, Logger } from "@nestjs/common";
import type { GroupedResolvers, ResolverLog } from "./types";

@Injectable()
export class GqlInspectorService {
  private logs: ResolverLog[] = [];
  private readonly logger = new Logger("GqlInspector");

  log(field: string, duration: number) {
    this.logs.push({
      field,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  printSummary(threshold: number = 300) {
    const slowLogs = this.logs.filter((log) => log.duration >= threshold);
    if (!slowLogs.length) {
      this.logger.log("✅ No slow resolvers detected");
      return;
    }

    this.logger.warn(`⚠️ Slow Resolvers (>${threshold}ms):`);

    const grouped = slowLogs.reduce((acc: GroupedResolvers, log) => {
      acc[log.field] = acc[log.field] || [];
      acc[log.field].push(log.duration);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([field, durations]) => {
      const avg = Math.round(
        durations.reduce((a, b) => a + b) / durations.length
      );
      this.logger.warn(
        `• ${field} — avg: ${avg}ms (${durations.length} calls)`
      );
    });
  }

  getRawLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}
