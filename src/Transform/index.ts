import { Message } from '../definitions/Console'
import Arithmetic from './arithmetic'
import BigInt from './BigInt'
import Date from './Date'
import Function from './Function'
import HTML from './HTML'
import Map from './Map'

import Replicator from './replicator'
import Set from './Set'

const transforms = [HTML, Function, Arithmetic, Map, BigInt, Date, Set]

const replicator = new Replicator()
replicator.addTransforms(transforms)

export function Encode<T>(data: any, limit?: number): T {
  return JSON.parse(replicator.encode(data, limit))
}

export function Decode(data: any): Message {
  const decoded = replicator.decode(JSON.stringify(data))
  // remove __console_feed_remaining__
  decoded.data.pop()
  return decoded
}
