LEFT_LINE_MARGIN = 50;
BOTTOM_LINE_MARGIN = 50;

// A class that represents the bar visualization
class Bar {
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

        d3.select('#bar-svg')
        .attr('height', 1000)
        .attr('width', 1010);

        d3.select('#bar-axis-labels')
        .append('text')
        .attr('x', '485')
        .attr('y', '990')
        .text('Year');

        d3.select('#bar-axis-labels')
        .append('text')
        .attr('id', 'bar-axis-label-y')
        .attr('transform', 'translate(20, 520) rotate(270)')
        .text('Picks/Bans');

        
        const barHolder = d3.select('#bars');
        for(var i = 0; i < 10; i++) {
            barHolder.append("g").attr('id', `rect-holder-${i}`);
        }
    }

    // Draws the table, using the specified champions, colorScale, and column of the data
    drawVisuals(currentChamps, colorScale, col) {
        let min = 100000000;
        let max = -1;

        for(const key in this.champData) {
            const val = this.champData[key];
            min = Math.min(min, d3.min(val.map(d => d[col])));
            max = Math.max(max, d3.max(val.map(d => d[col])));
        }

        const xScale = d3.scalePoint()
        .domain([...years, '2023'])
        .range([50, 950]);

        const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([950, 50]);

        d3.select('#x-barAxis')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,950)`);

        d3.select('#y-barAxis')
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(50, 0)`);

        d3.select('#bar-svg')
        .select('#bars')
        .selectAll('g')
        .data(currentChamps)
        .join('g')
        .selectAll('rect')
        .data((d, i) => this.champData[d].map(el => [el, i]))
        .join('rect')
        .attr('x', d => xScale(d[0].year) + (10 * d[1]))
        .attr('y', d => yScale(d[0][col]))
        .attr('width', 6)
        .attr('height', d => 950 - yScale(d[0][col]))
        .attr('fill', d => colorScale(d[0].Champion))
        .on('mousemove', (e, d) => {
            // Find the mouse position so we can draw tooltip
            let x = e.pageX;
            let y = e.pageY - 255;
            if (x > 500) {
                x = x - 195;
            } 

            // Delete the old tooltip
            d3.select('#bar-svg')
            .select('#tooltip')
            .selectAll('g')
            .remove();

            // Draw the new tooltip
            const g = d3.select('#bar-svg')
            .select('#tooltip')
            .append('g')
            .attr('id', `${d[0].Champion}-rect`);

            g.append('rect')
            .attr('class', 'tooltip')
            .attr('id', `${d[0].Champion}-tooltip`)
            .attr('x', x + 20)
            .attr('y', y + 20)
            .attr('height', 50)
            .attr('width', 150)

            g.append('image')
            .attr('href', `data/icons/${d[0].Champion.replace(' ', '_')}Square.png`)
            .attr('height', 50)
            .attr('width', 50)
            .attr('x', x + 20)
            .attr('y', y - 30);
            g.append('text')
            .attr('x', x + 30)
            .attr('y', y + 33)
            .attr('class', 'tooltiptext')
            .append('tspan')
            .attr('id', 'tooltip-champ-name')
            .text(`${d[0].Champion}`)
            .attr('dy', 1.2)
            .append('tspan')
            .attr('id', 'tooltip-data')
            .text(`${col}: ${d[0][col]}`)
            .attr('x', x + 30)
            .attr('dy', 15)
            .append('tspan')
            .text(`Year: ${d[0].year}`)
            .attr('x', x + 30)
            .attr('dy', 15);
        })
        .on('mouseleave', _ => {
            d3.select('#bar-svg')
            .select('#tooltip')
            .selectAll('g')
            .remove();
        });
        

        d3.select('#bar-axis-label-y')
        .text(col);
    }

    // Parses data as a string and returns it as a number type. This allows us to use the numbers in computations later.
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
}