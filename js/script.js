years = []
for (i = 2011; i <= 2022; i++) {
    years.push(i + '')
}
datMap = {};
champs = new Set();
champData = {};

async function loadData() {
    for(i = 0; i < years.length; i++) {
        datMap[years[i]] = [];
        await d3.csv(`./data/worlds - ${years[i]}.csv`, (rows) => {
            datMap[years[i]].push(rows);
        });
    }
}

loadData().then(() => {
    years.forEach(d => {
    
        datMap[d].forEach(champ => {
            champs.add(champ.Champion);
        });
        
        champs.forEach(c => {
            champData[c] = []
            years.forEach(y => {
                const tempList = datMap[y].filter(d => d.Champion == c);
                if (tempList.length > 0) {
                    const champPt = tempList[0];
                    champPt.year = y;
                    champData[c].push(champPt);
                }
            });
        });
    });

    const lines = new Lines(champData, years, Array.from(champs));
    const table = new Table(champData, years, Array.from(champs), datMap);
});
