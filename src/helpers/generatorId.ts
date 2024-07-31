import { uniqueId } from 'lodash';

export const generatorId = (prefix: string): string => uniqueId(prefix);
