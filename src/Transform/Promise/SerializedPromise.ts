class TrackablePromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.error = undefined

    // Create the actual promise
    this.promise = new Promise((resolve, reject) => {
      const trackResolve = (value) => {
        this.state = 'fulfilled'
        this.value = value
        resolve(value)
      }

      const trackReject = (error) => {
        this.state = 'rejected'
        this.error = error
        reject(error)
      }

      try {
        executor(trackResolve, trackReject)
      } catch (error) {
        trackReject(error)
      }
    })

    // Add standard promise methods
    this.then = (...args) => this.promise.then(...args)
    this.catch = (...args) => this.promise.catch(...args)
    this.finally = (...args) => this.promise.finally(...args)
  }

  // Get current state synchronously
  getState() {
    return {
      state: this.state,
      value: this.value,
      error: this.error,
    }
  }

  // Serialize the promise state
  serialize() {
    return JSON.stringify({
      state: this.state,
      value: this.value,
      error: this.error ? this.error.message : undefined,
    })
  }

  // Create a new TrackablePromise from serialized state
  static deserialize(serializedData) {
    const data = JSON.parse(serializedData)

    return new TrackablePromise((resolve, reject) => {
      if (data.state === 'fulfilled') {
        resolve(data.value)
      } else if (data.state === 'rejected') {
        reject(new Error(data.error))
      }
      // If pending, the promise will remain pending
    })
  }

  // Create a TrackablePromise from a regular Promise
  static from(promise) {
    return new TrackablePromise((resolve, reject) => {
      promise.then(resolve, reject)
    })
  }
}

export default TrackablePromise
