interface Storage {
  name: string
  body: object
  proto: string
}

/**
 * Serialize a Date into JSON
 */
export default {
  type: 'Date',
  lookup: Date,
  shouldTransform(type: any, obj: any) {
    return obj && obj.constructor && obj.constructor.name === 'Date'
  },
  toSerializable(date: any): Storage {
    let body = { date: date.toString() }

    return {
      name: 'Date',
      body,
      proto: Object.getPrototypeOf(date).constructor.name,
    }
  },
  fromSerializable(data: Storage) {
    const { body } = data
    let obj = { ...body }

    if (typeof data.proto === 'string') {
      // @ts-ignore
      obj.constructor = {
        name: data.proto,
      }
    }

    return obj
  },
}
