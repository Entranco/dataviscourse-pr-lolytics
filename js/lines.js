class Lines {
    constructor(champData, years, champs) {
        this.years = years;
        this.champData = champData;
        this.champs = champs;
        this.selected = 'KDA';

        d3.select('#line-svg')
        .attr('height', 1000)
        .attr('width', 1000);

        //this.timeScale = d3

        this.drawVisuals()
    }

    drawVisuals() {
        const col = this.selected;
        // draw some lines

        let min = 100000000;
        let max = -1;

        for([key, val] in this.champData.entries()) {
            min = Math.min(min, d3.min(val.map(d => d[col])));
            max = Math.max(max, d3.max(val.map(d => d[col])));
        }

        const xScale = d3.scaleOrdinal()
        .domain(years.map(years))
        .range([0, 1000]);

        const yScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, 1000]);

        for([key, val] in this.champData.entries()) {
            const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d[col]));

            d3.select('#line-svg')
            .select('#lines')
            .selectAll('path')
            .data(this.champs)
            .join('path')
            .datum(d => champData[d])
            .attr('d', line);

            
        }
    }


}