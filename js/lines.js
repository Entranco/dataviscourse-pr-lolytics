class Lines {
    constructor(dataMap, years, cols) {
        this.years = years;
        this.dataMap = dataMap;
        this.cols = cols;
        this.selected = None

        d3.select('#line-svg')
        .attr('height', 1000)
        .attr('width', 1000);

        //this.timeScale = d3

        this.drawVisuals()
    }

    drawVisuals() {

        // draw some lines
        d3.select('#line-svg')
        .select('#lines')
        .selectAll('line')
        .data(this.years)
        .join('line')
        .attr('') 
    }


}