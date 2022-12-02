import { Source } from "strict-callbag"
import { chain } from "./chain.js"
import { flatten } from "./flatten.js"
import { fromThunk } from "./fromThunk.js"
import { NONE } from "./none.js"
import { pipe } from "./pipe.js"
import { repeatWhile } from "./repeatWhile.js"

export const resource =
  <Acc, A, E, E1>(
    initial: Acc,
    project: (
      acc: Acc,
      index: number,
    ) => Source<readonly [Acc | NONE, Source<A, E>], E1>,
    cleanup?: (acc: Acc) => void,
  ): Source<A, E | E1> =>
  (_, sink) => {
    let acc = initial
    let index = 0

    pipe(
      fromThunk(() => project(acc, index++)),
      flatten,
      repeatWhile((_, lastItem) => {
        if (lastItem !== NONE && lastItem[0] !== NONE) {
          acc = lastItem[0]
          return true
        }

        cleanup?.(acc)
        return false
      }),
      chain(([_, source]) => source),
    )(0, sink)
  }
