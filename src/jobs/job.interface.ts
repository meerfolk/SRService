import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';

export interface JobInterface {
  name: string,
  task: E.Either<Error, T.Task<any>>,
}