class Lines {
    constructor(dataMap, years, cols) {
        this.years = years;
        this.dataMap = dataMap;
        this.cols = cols;
        this.selected = None

        d3.select('#line-svg')
        .attr('height', 1000)
        .attr('width', 1000);

        this.drawVisuals()
    }

    drawVisuals() {
        d3.select('#line-svg')
        .select('#lines')
        .selectAll('line')
        .join(this.dataMap)
    }
}