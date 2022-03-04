export const enum RqJobStatus {
  QUEUED = "queued", //queu
  FINISHED = "finished",
  FAILED = "failed", // fail
  STARTED = "started", // running
  DEFERRED = "deferred", // queued
  SCHEDULED = "scheduled", // queud
  STOPPED = "stopped",  // fail
  CANCELED = "canceled" //fail
}

export interface FastApiValidationError {
  loc: string,
  msg: string,
  type: string
}
