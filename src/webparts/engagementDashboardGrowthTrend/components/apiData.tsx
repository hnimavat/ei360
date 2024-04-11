const revenue = {
    chartData : [
        { x: 'Jan 23', y: 1400000, ...({ lineData: { y: 1000000 } }) },
        { x: 'Feb 23', y: 1000000, ...({ lineData: { y: 1100000 } }) },
        { x: 'Mar 23', y: 5000000, ...({ lineData: { y: 1200000 } }) },
        { x: 'Apr 23', y: 2500000, ...({ lineData: { y: 1300000 } }) },
        { x: 'May 23', y: 3000000, ...({ lineData: { y: 1400000 } }) },
        { x: 'Jun 23', y: 2500000, ...({ lineData: { y: 1500000} }) },
        { x: 'Jul 23', y: 2000000, ...({ lineData: { y: 1600000 } }) },
        { x: 'Aug 23', y: 2200000, ...({ lineData: { y: 1700000 } }) },
        { x: 'Sep 23', y: 2700000, ...({ lineData: { y: 1800000} }) },
        { x: 'Oct 23', y: 1700000, ...({ lineData: { y: 1900000} }) },
        { x: 'Nov 23', y: 1800000, ...({ lineData: { y: 2000000} }) },
        { x: 'Dec 23', y: 1850000, ...({ lineData: { y: 2100000} }) },
      ],
    chartLineColors : ["#34C38F"],
    chartLineLegendColor : '#74788D'
}

const team = {
  chartData : [
      { x: 'Jan 23', y: 25, ...({ lineData: { y: 25 } }) },
      { x: 'Feb 23', y: 30, ...({ lineData: { y: 24 } }) },
      { x: 'Mar 23', y: 35, ...({ lineData: { y: 23 } }) },
      { x: 'Apr 23', y: 50, ...({ lineData: { y: 22 } }) },
      { x: 'May 23', y: 30, ...({ lineData: { y: 21 } }) },
      { x: 'Jun 23', y: 20, ...({ lineData: { y: 20 } }) },
      { x: 'Jul 23', y: 25, ...({ lineData: { y: 19} }) },
      { x: 'Aug 23', y: 30, ...({ lineData: { y: 18} }) },
      { x: 'Sep 23', y: 50, ...({ lineData: { y: 17} }) },
      { x: 'Oct 23', y: 30, ...({ lineData: { y: 16} }) },
      { x: 'Nov 23', y: 50, ...({ lineData: { y: 15} }) },
      { x: 'Dec 23', y: 10, ...({ lineData: { y: 14} }) },
    ],
  chartLineColors : ["#34C38F"],
  chartLineLegendColor : '#74788D'
}

export { revenue, team }