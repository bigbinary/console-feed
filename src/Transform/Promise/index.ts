import SerializedPromise from './SerializedPromise'

interface Storage {
  name: string
  body: object
  status?: string
  proto: string
}

function promiseState(promise) {
  const pendingState = { status: 'pending' }

  return Promise.race([promise, pendingState]).then(
    (value) =>
      value === pendingState ? value : { status: 'fulfilled', value },
    (reason) => ({ status: 'rejected', reason })
  )
}
/**
 * Serialize a Promise into JSON
 */
export default {
  type: 'Promise',
  lookup: Promise,
  shouldTransform(type: any, obj: any) {
    return obj && obj.constructor && obj.constructor.name === 'Promise'
  },
  toSerializable(promise: any): Storage {
    let body = {}
    const pending = {
      state: 'pending',
    }
    const serializedPromise = SerializedPromise.from(promise)
    const result = serializedPromise.serialize()

    console.log(result)
    return {
      name: 'Promise',
      status: result.status || 'pending',
      body,
      proto: Object.getPrototypeOf(promise).constructor.name,
    }
  },
  fromSerializable(data: Storage) {
    const { body, status } = data
    let obj = { ...body, status }

    if (typeof data.proto === 'string') {
      // @ts-ignore
      obj.constructor = {
        name: data.proto,
      }
    }

    return obj
  },
}
