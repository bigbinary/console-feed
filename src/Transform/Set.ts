interface Storage {
  name: string
  body: any[]
  proto: string
}

/**
 * Serialize a Set into JSON
 */
const REMAINING_KEY = '__console_feed_remaining__'
export default {
  type: 'Set',
  lookup: Set,
  shouldTransform(type: any, obj: any) {
    return obj && obj.constructor && obj.constructor.name === 'Set'
  },
  toSerializable(set: any): Storage {
    let body = []

    set.forEach(function (value, key) {
      const v = typeof value == 'object' ? JSON.stringify(value) : value
      if (typeof v === 'string' && v.includes(REMAINING_KEY)) {
        return
      }
      body.push(value)
    })

    return {
      name: 'Set',
      body,
      proto: Object.getPrototypeOf(set).constructor.name,
    }
  },
  fromSerializable(data: Storage) {
    const { body } = data
    let obj = {
      ...body.filter((value) => {
        if (typeof value !== 'string') return true
        return !value.includes(REMAINING_KEY)
      }),
    }

    obj = obj

    if (typeof data.proto === 'string') {
      // @ts-ignore
      obj.constructor = {
        name: data.proto,
      }
    }

    return obj
  },
}
