years = ['2019', '2020', '2021']
datMap = {}
cols = []

function groupDataByAttribute(data) {
    attrMap = {}

    for ([key, value] in data.entries) {
        data[key]
    }
}

Promise.apply(() => {
    years.forEach(d => {
        datMap[d] = d3.csv(`./data/worlds_${d}.csv`);
    })
}).then(() => {

})