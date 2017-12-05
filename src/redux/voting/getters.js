export const getStatistics = (state) => {
  const polls = state.list().valueSeq().toArray()
  const time = new Date().getTime()

  return state.isFetched()
    ? {
      all: state.pollsCount().toString(),
      completed: polls.filter((p) => !p.poll().status()).length,
      ongoing: state.activePollsCount().toString(),
      inactive: polls.filter((p) => !p.poll().active()).length,
      outdated: polls.filter((p) => p.poll().deadline().getTime() < time).length,
    }
    : {}
}
