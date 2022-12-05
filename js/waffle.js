// A class that represents the waffle chart in our visualizations
class Waffle {
    constructor(champData, years, selectedChamps, allChamps, dateMap) {
        this.allChamps = allChamps;
        this.champData = champData;
    }

    // This draws a new waffle using the passed in champs, column of the data, year, and colorScale.
    drawWaffle(selectedChamps, col, year, colorScale) {
        let all_total = 0
        let other_total = 0

        const squares = 500

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
        let excess = 0
        // For each champ, calculate how many squares it should be assigned
        for (var champ of selectedChamps) {
            let all_years = this.champData[champ];
            let curr_year_data = all_years[year - 2011];
            let cap = Math.ceil(curr_year_data[col] * squares / all_total)
            if ((curr_year_data[col] * squares % all_total) != 0) {
                excess = excess + (all_total - ((curr_year_data[col] * squares) % all_total))
            }
            
            data.push({"name" : champ, "value" : cap});
        }

        // Calculate how many squares "Other" should be assigned
        data.push({"name" : "Other", "value" : Math.round(((other_total * squares * 1.0) - excess) / all_total)});

              
        var chart = d3waffle(colorScale).height(675).rows(20);
              
        d3.select("#waffle-div")
            .datum(data)
            .call(chart);
    }
}