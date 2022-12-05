// The table class represents the table in our visualization. It is also in charge of sending new data
// to the waffle and bar charts when rows are selected or deselected.
class Table {
    constructor(champData, years, champs, datemap, bar, cols, waffle) {
        this.years = years;
        this.champData = champData;
        this.champs = champs;
        this.currYear = 2022;
        this.datemap = datemap;
        this.selectedChamps = [];
        this.selectedCol = [null, false];
        this.bar = bar;
        this.waffle = waffle;
        this.dataCol = "Picks/Bans";
        this.defaultCharts();
        

        d3.select("#select-button")
            .selectAll('myOptions')
            .data(this.years)
            .enter()
            .append('option')
            .text(d => d)
            .attr("value", d => d)
            .attr("selected", d => d == "2022");

        d3.select("#select-button").on("change", d => {
            let option = d3.select("#select-button").property("value")
            this.currYear = parseInt(option)
            this.selectedChamps.forEach(champ => {
                d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', 'white');
            })
            this.selectedChamps = [];
            this.drawTable(this.datemap[this.currYear]);
            this.defaultCharts();
        });

        d3.select("#column-headers")
        .selectAll("th")
        .data(["Champion", ...cols])
        .on("click", (a, d) => {
            // Swaps sorting settings when clicking on a column
            if(this.selectedCol[0] == d) {
                this.selectedCol[1] = !this.selectedCol[1]
            }
            else {
                this.selectedCol[0] = d;
                this.selectedCol[1] = false;
            }

            // Sorts a column in ascending or descending order
            const tempArr = [...this.datemap[this.currYear]];
            if (d == "Champion") {
                tempArr.sort((a, b) => a[d].localeCompare(b[d]));
            }
            else {
                tempArr.sort((a, b) => a[d] - b[d]);
            }
            
            if (!this.selectedCol[1]) {
                tempArr.reverse();
            }

            // Redoes table highlighting to follow the new row order
            this.selectedChamps.forEach(champ => {
                d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', "white");
            });
            this.drawTable(tempArr);
            this.selectedChamps.forEach(champ => {
                d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', this.colorScale(champ));
            });
            if (d != "Champion") {
                this.dataCol = d;
                if (this.selectedChamps.length == 0) {
                    this.defaultCharts()
                }
                else {
                    // Redraw if this is a new column type
                    this.bar.drawVisuals(this.selectedChamps, this.colorScale, this.dataCol);
                    this.waffle.drawWaffle(this.selectedChamps, this.dataCol, this.currYear, this.colorScale);
                }
            }
            
        });

        this.drawTable(this.datemap[this.currYear]);
    }

    // Draws the table, using the input rows.
    drawTable(rows) {
        let rowSelection = d3.select('#table-body')
            .selectAll('tr')
            .data(rows)
            .join('tr')
            .attr('id', d => `${this.champNameScrub(d.Champion)}-row`)
            .on('click', (i, d) => {
                // If we click a row, we should highlight it
                if (this.selectedChamps.find(dat => dat == d.Champion)) {
                    this.selectedChamps = this.selectedChamps.filter(dat => dat != d.Champion);
                    d3.select(`#${this.champNameScrub(d.Champion)}-row`).style('background-color', 'white');
                }
                else {
                    this.selectedChamps.push(d.Champion);
                    if (this.selectedChamps.length > 5) {
                        this.selectedChamps.forEach(champ => {
                            d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', 'white');
                        });
                        this.selectedChamps = [d.Champion]
                    }
                }

                // Redraw with the new row included
                if (this.selectedChamps.length == 0) {
                    this.defaultCharts();
                    return;
                }
                
                const colorScale = this.createColorScale(this.selectedChamps);

                this.colorScale = colorScale;

                this.selectedChamps.forEach(champ => {
                    d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', colorScale(champ));
                });
                this.bar.drawVisuals(this.selectedChamps, colorScale, this.dataCol);
                this.waffle.drawWaffle(this.selectedChamps, this.dataCol, this.currYear, colorScale);
            });
        
        rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join(enter => {
                const statSelection = enter.append('td')
                .attr("id", d => d.id);

                statSelection.filter(d => d.id == "champ-td")
                .append('img')
                .attr('src', d => `data/icons/${d.value.replace(' ', '_')}Square.png`)
                .attr('height', 20)
                .attr('width', 20);
        
                statSelection.filter(d => d.type === "text")
                .append('span')
                .text(d => ` ${d.value}`);
            },
            update => {
                update.select('img')
                .attr('src', d => `data/icons/${d.value.replace(' ', '_')}Square.png`)
                
                update.select('span')
                .text(d => ` ${d.value}`)
            },
            exit => {
                exit.remove();
            })
    }

    // Creates a color scale mapping from the input champs to our color scheme. Also always maps "Other" to gray for use in the waffle chart.
    createColorScale(champs) {
        return d3.scaleOrdinal()
        .domain([...champs, "Other"])
        .range([...d3.schemeCategory10.slice(0, champs.length), "#808080"]);
    }

    // This takes every column from a data point and conforms it to a data structure, such that we can create one td per column in the data point.
    rowToCellDataTransform(d) {
        let champion_info = {
            type : "text",
            value : d["Champion"],
            id : "champ-td"
        }

        let pick_ban_info = {
            type : "text",
            value : d["Picks/Bans"],
            id : "pick_ban_td"
        }

        let pick_ban_rate_info = {
            type : "text",
            value : d["Pick/Bans%"],
            id : "pick_ban_rate_td"
        }

        let ban_info = {
            type : "text",
            value : d["Bans"],
            id : "ban_info_td"
        }

        let pick_info = {
            type : "text",
            value : d["Picks"],
            id : "pick_info_td"
        }

        let player_info = {
            type : "text",
            value : d["Players"],
            id : "player_info_td"
        }

        let win_info = {
            type : "text",
            value : d["Wins"],
            id : "win_info_td"
        }

        let loss_info = {
            type : "text",
            value : d["Losses"],
            id : "loss_info_td"
        }

        let winrate_info = {
            type : "text",
            value : d["Winrate"],
            id : "winrate_info_td"
        }

        let kill_info = {
            type : "text",
            value : d["Kills"],
            id : "kill_info_td"
        }

        let death_info = {
            type : "text",
            value : d["Deaths"],
            id : "death_info_td"
        }

        let assist_info = {
            type : "text",
            value : d["Assists"],
            id : "assist_info_td"
        }

        let kda_info = {
            type : "text",
            value : d["KDA"],
            id : "kda_info_td"
        }

        let dataList = [champion_info, pick_ban_info, pick_ban_rate_info, ban_info, pick_info, player_info, win_info, 
                        loss_info, winrate_info, kill_info, death_info, assist_info, kda_info]

        return dataList
    }

    champNameScrub(champ) {
        return champ.replace(' ', '').replace('\'', '');
    }

    // Generates the "default" (top five champs) view for the bar and waffle charts. This is used when no rows are selected in the table.
    defaultCharts() {
        const tempChamps = this.champs.slice(0, this.champs.length);
        tempChamps.sort((a, b) => this.champData[b][parseInt(this.currYear) - 2011][this.dataCol] - this.champData[a][parseInt(this.currYear) - 2011][this.dataCol]);
        const slicey = tempChamps.slice(0, 5);
        this.colorScale = this.createColorScale(slicey);
        
        this.bar.drawVisuals(slicey, this.colorScale, this.dataCol);
        this.waffle.drawWaffle(slicey, this.dataCol, this.currYear, this.colorScale);
    }
    
}