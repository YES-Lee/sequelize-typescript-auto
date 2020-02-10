module.exports = function initTask(ctor) {
  const prototype = ctor.prototype

  prototype.__taskQueue = []

  prototype.task = function(fn) {
    this.__taskQueue.push(fn)
  }

  prototype.run = function() {
    for (const task of this.__taskQueue) {
      if (this.__t) {
        this.__t.then(i => {
          const out = task(i)
          return out instanceof Promise ? out : Promise.resolve(e)
        })
      } else {
        const out = task()
        this.__t = out instanceof Promise ? out : Promise.resolve(r)
      }
    }
  }
}