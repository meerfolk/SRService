import { JobInterface } from './job.interface';

const Jobs: JobInterface[] = [];

export const addJob = (job: JobInterface) => [...Jobs, job];

export const getJobs = () => Jobs;

export * from './job.interface';
export * from './addDefaultJobs';