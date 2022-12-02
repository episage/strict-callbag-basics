import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("zip", () => {
  test("it emits the latest items from each source", async () => {
    const a = pipe(CB.fromIter([1, 2, 3, 4, 5]), CB.delay(9))
    const b = pipe(CB.fromIter(["a", "b", "c"]), CB.delay(5))

    const result = await pipe(CB.zip_(a, b), CB.toArray, CB.lastItemFrom)

    assert.deepEqual(result, [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ])
  })

  test("it emits if source ends immediately", async () => {
    const a = CB.fromCallback<number>((cb) => cb(undefined, 1))
    const b = pipe(CB.fromIter(["a", "b", "c"]), CB.delay(0))

    const result = await pipe(a, CB.zip(b), CB.toArray, CB.lastItemFrom)

    assert.deepEqual(result, [[1, "a"]])
  })
})
