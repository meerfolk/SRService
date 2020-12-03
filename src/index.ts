import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/Either';

import { startScheduler } from './startScheduler';

(function run() {
  pipe(
    startScheduler,
  );
})();
