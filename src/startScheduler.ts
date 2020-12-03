import { pipe } from 'fp-ts/pipeable';
import * as A from 'fp-ts/Array';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';

import { addDefaultJobs, JobInterface } from './jobs';

const startJobSchedule = (job: JobInterface) => {
  setInterval(
    () => pipe(
      job.task,
      E.fold(
        (error) => console.log(`${job.name} fail: ${error}`),
        task => 
          task()
            .then(console.log)
            .catch((error) => console.log(`
              ${job.name} request fail
              ${error}
            `)),
      ),
    ),
    5000,
  );
}

export const startScheduler = pipe(addDefaultJobs, E.map(A.map(startJobSchedule)));