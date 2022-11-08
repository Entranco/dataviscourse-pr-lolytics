years = ['2019', '2020', '2021']
datMap = {}


Promise.apply(() => {
    years.forEach(d => {
        datMap[d] = d3.csv(`./data/worlds_${d}.csv`);
    })
}).then(() => {
    
})