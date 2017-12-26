export const getStatistics = (state) => {
  const polls = state.list().items()
  const time = new Date().getTime()

  return state.isFetched()
    ? {
      all: state.pollsCount().toString(),
      completed: polls.filter((p) => !p.poll().status()),
      ongoing: state.activePollsCount().toString(),
      inactive: state.pollsCount().minus(state.activePollsCount()).toString(),
      outdated: polls.filter((p) => p.poll().deadline().getTime() < time).length,
    }
    : {}
}
