class Waffle {
    constructor(champData, years, selectedChamps, allChamps, dateMap) {
        this.allChamps = allChamps;
        this.champData = champData;
        this.defaultWaffle("KDA", 2022);
    }

    filterChamps(champs, col, year) {
        if (champs.length == 0) {
            this.defaultWaffle(col, year)
        }

        this.drawWaffle(champs, col, year);
    }

    defaultWaffle(col, year) {
        this.drawWaffle(this.allChamps.slice(0,5), col, year);
    }

    drawWaffle(selectedChamps, col) {
        const year = 2022;
        const colorScale = d3.scaleOrdinal()
            .domain(["Other", ...selectedChamps])
            .range(['#808080', ...d3.schemeCategory10]);

        let all_total = 0
        let other_total = 0

        let squares = 500

        for (var champ of this.allChamps) {
            let all_years = this.champData[champ]
            let curr_year_data = all_years[year - 2011]

            if (selectedChamps.includes(champ)) {

            } else {
                other_total += curr_year_data[col]
            }

            all_total += curr_year_data[col]
        } 

        var data = []
        for (var champ of selectedChamps) {
            let all_years = this.champData[champ]
            let curr_year_data = all_years[year - 2011]

            data.push({"name" : champ, "value" : (curr_year_data[col] * squares) / all_total})
        }

        data.push({"name" : "Other", "value" : (other_total * squares) / all_total})
              
        var chart = d3waffle(colorScale).height(750).rows(20);
              
        d3.select("#waffle-div")
            .datum(data)
            .call(chart);
    }
}