export default (rankingPercentile) => {
  if (rankingPercentile > 0.95) {
    return 5
  }
  if (rankingPercentile > 0.7) {
    return 4
  }
  if (rankingPercentile > 0.4) {
    return 3
  }
  if (rankingPercentile > 0.05) {
    return 2
  }
  return 1
}
