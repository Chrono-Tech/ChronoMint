const getStatistics = (state) => {
  const polls = state.list().items()
  const time = new Date().getTime()

  let completed = 0
  let ongoing = 0
  let inactive = 0
  let outdated = 0

  if (state.isFetched()) {
    polls.map((p) => {
      if (!p.isFetched()) {
        return
      }

      if (!p.poll().status()) {
        completed++
      }

      if (p.poll().status() && p.poll().active()) {
        ongoing++
      }

      if (!p.poll().active()) {
        inactive++
      }

      if (p.poll().deadline().getTime() < time) {
        outdated++
      }
    })
  }

  return state.isFetched()
    ? {
      all: polls.length,
      completed,
      ongoing,
      inactive,
      outdated,
    }
    : {}
}

export default getStatistics
