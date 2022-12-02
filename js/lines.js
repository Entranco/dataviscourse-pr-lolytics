LEFT_LINE_MARGIN = 50;
BOTTOM_LINE_MARGIN = 50;

class Lines {
    constructor(champData, years, champs, cols) {
        this.years = years;
        this.champData = champData;
        this.champs = champs;

        for(const key in this.champData) {
            this.champData[key] = this.champData[key].map((d) => {
                cols.forEach((c) => {
                    d[c] = this.convertDataToNum(d[c]);
                })
                return d;
            })
        }
        this.selected = 'KDA';

        d3.select('#line-svg')
        .attr('height', 1000)
        .attr('width', 1000);

        d3.select('#line-axis-labels')
        .append('text')
        .attr('x', '485')
        .attr('y', '990')
        .text('Year');

        d3.select('#line-axis-labels')
        .append('text')
        .attr('id', 'line-axis-label-y')
        .attr('x', '0')
        .attr('y', '490')
        .text('Picks/Bans');

        this.defaultLines("Picks/Bans");
    }

    drawVisuals(currentChamps, colorScale, col) {
        // draw some lines

        let min = 100000000;
        let max = -1;

        for(const key in this.champData) {
            const val = this.champData[key];
            min = Math.min(min, d3.min(val.map(d => d[col])));
            max = Math.max(max, d3.max(val.map(d => d[col])));
        }

        const xScale = d3.scalePoint()
        .domain(years)
        .range([50, 950]);

        const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([950, 50]);

        d3.select('#x-lineAxis')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,950)`);

        d3.select('#y-lineAxis')
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(50, 0)`);


        const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d[col]));

        
        d3.select('#line-svg')
        .select('#lines')
        .selectAll('path')
        .data(currentChamps.map(champ => this.champData[champ]))
        .join('path')
        .datum(d => d)
        .attr('d', line)
        .attr('stroke', d => colorScale(d[0].Champion))
        .attr('stroke-width', 2);

        d3.select('#line-axis-label-y')
        .text(col);
    }

    convertDataToNum(data) {
        if (data == '-') {
            return 0.0;
        }
        else if (data.endsWith("%")) {
            return parseFloat(data.slice(0, data.length - 1));
        }
        else {
            return parseFloat(data);
        }
    }

    filterChamps(champs, colorScale, col) {
        if (champs.length == 0) {
            this.defaultLines(col);
            return;
        }

        this.drawVisuals(champs, colorScale, col);
    }
    
    defaultLines(col) {
        const slicey = this.champs.slice(0, 10);

        const colorScale = d3.scaleOrdinal()
        .domain(slicey)
        .range(d3.schemeCategory10);

        this.drawVisuals(slicey, colorScale, col);
    }
}