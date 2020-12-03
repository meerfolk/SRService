import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { pipe } from 'fp-ts/pipeable';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import config from 'config';

import { anyToError } from '../helpers';

import { ConnectionInterface } from './connection.interface';

const getConnectionString =
  (connection: ConnectionInterface = config.get('blobStorage')): string => {
    const { account, sas } = connection;
    return `https://${account}.blob.core.windows.net${sas}`;
  }

const getBlobClient =
  (connection: ConnectionInterface): E.Either<Error, ContainerClient> => {
    return E.tryCatch(
      () =>
        new BlobServiceClient(
          getConnectionString(connection)
        ).getContainerClient(connection.container),
      anyToError,
    );
  }

const getBlobContentTask =
  (blobName: string) =>
  (client: ContainerClient): T.Task<Record<string, string>> => 
  () => 
    client
      .getBlobClient(blobName)
      .download()
      .then(blob => blob.readableStreamBody)
      .then(readStreamToString)
      .then(raw => JSON.parse(raw));

const readStreamToString =
  (stream: NodeJS.ReadableStream): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
        stream.on('error', reject);
      });

export const getBlobContent = 
  (connection: ConnectionInterface) =>
  (blobName: string): E.Either<Error, T.Task<Record<string, string>>> => 
    pipe(
      getBlobClient(connection),
      E.map(getBlobContentTask(blobName)),
    );