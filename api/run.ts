import { Sink, Source } from "strict-callbag"
import { noop } from "../Sink/noop.js"
import { createPipe } from "./createPipe.js"

export const run_ = <A, E, EO>(
  self: Source<A, E>,
  sink: Sink<A, E, EO> = noop(),
  ignoreEnd = false,
): Promise<void> =>
  new Promise((resolve, reject) => {
    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest(s) {
        s.pull()
      },
      onData(_s, data) {
        sink(1, data)
      },
      onEnd(err) {
        if (err || ignoreEnd === false) {
          sink(2, err)
        }

        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
      onAbort(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    })
  })

export const run =
  <A, E, EO>(sink?: Sink<A, E, EO>, ignoreEnd?: boolean) =>
  (self: Source<A, E>) =>
    run_(self, sink, ignoreEnd)
