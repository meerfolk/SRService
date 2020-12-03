import * as T from 'fp-ts/Task';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { ConnectionInterface, getBlobContent } from '../blob-storage';
import { getConfig } from '../helpers/get-config';

import { addJob, JobInterface } from '.';

const getBlobsCorrelation =
  (connection: ConnectionInterface) =>
    getBlobContent(connection)('recognition-info.json');

const getDefaultJobs =
  (connection: ConnectionInterface): JobInterface[] =>
    [
      {
        name: 'Get blob correlation data',
        task: getBlobsCorrelation(connection),
      }
    ]

export const addDefaultJobs =
  pipe(
    getConfig<ConnectionInterface>('blobStorage'),
    O.fold(
      () => E.left(new Error('Blob storage config not found')),
      (blobStorageConfig) => E.right(blobStorageConfig),
    ),
    E.map(getDefaultJobs),
    E.map(A.map(addJob)),
    E.map(A.flatten)
  )