years = []
for (i = 2011; i <= 2022; i++) {
    years.append(i + '')
}
datMap = {}

Promise.apply(() => {
    years.forEach(d => {
        datMap[d] = d3.csv(`./data/worlds_${d}.csv`);
    })
}).then(() => {

})