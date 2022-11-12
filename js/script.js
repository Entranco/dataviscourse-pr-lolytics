years = []
for (i = 2011; i <= 2022; i++) {
    years.push(i + '')
}
datMap = {};
champs = new Set();
champData = {};
cols = ["Picks/Bans", "Pick/Bans%", "Bans", "Picks", "Players", "Wins", "Losses", "Winrate", "Kills", "Deaths", "Assists", "KDA", "CS", "CS/M", "Gold", "Gold/Min", "Damage", "Damage/Min", "KP", "Kill_Share", "Gold_Share"]


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
            else {
                const champPt = {}
                champPt.year = y;
                champPt.Champion = c;
                cols.forEach(c => {
                    champPt[c] = "-";
                })
                champData[c].push(champPt);
            }
        });
    });

    const newChamps = Array.from(champs);
    newChamps.sort((a, b) => a.localeCompare(b), cols);

    const lines = new Lines(champData, years, newChamps, cols);
    const table = new Table(champData, years, Array.from(champs), datMap, lines);
});
