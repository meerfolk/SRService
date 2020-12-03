import config from 'config';
import * as O from 'fp-ts/Option';


export const getConfig = <T>(path: string): O.Option<T> => O.of(config.get<T>(path));
