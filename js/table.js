class Table {
    constructor(champData, years, champs, datemap, lines, cols, waffle) {
        this.years = years;
        this.champData = champData;
        this.champs = champs;
        this.currYear = 2022;
        this.datemap = datemap;
        this.selectedChamps = [];
        this.selectedCol = [null, false];
        this.lines = lines;
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
            const column = d3.select('#column-headers')
            .selectAll("th")
            .filter((dat, i) => dat == d)

            if(this.selectedCol[0] == d) {
                this.selectedCol[1] = !this.selectedCol[1]
            }
            else {
                this.selectedCol[0] = d;
                this.selectedCol[1] = false;
            }

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
                    this.lines.drawVisuals(this.selectedChamps, this.colorScale, this.dataCol);
                    this.waffle.drawWaffle(this.selectedChamps, this.dataCol, this.currYear, this.colorScale);
                }
            }
            
        });

        this.drawTable(this.datemap[this.currYear]);
    }

    drawTable(rows) {
        let rowSelection = d3.select('#table-body')
            .selectAll('tr')
            .data(rows)
            .join('tr')
            .attr('id', d => `${this.champNameScrub(d.Champion)}-row`)
            .on('click', (i, d) => {
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

                if (this.selectedChamps.length == 0) {
                    this.defaultCharts();
                    return;
                }
                
                const colorScale = d3.scaleOrdinal()
                .domain([...this.selectedChamps, "Other"])
                .range([...d3.schemeCategory10.slice(0, this.selectedChamps.length), '#808080']);

                this.colorScale = colorScale;

                this.selectedChamps.forEach(champ => {
                    d3.select(`#${this.champNameScrub(champ)}-row`).style('background-color', colorScale(champ));
                });
                this.lines.drawVisuals(this.selectedChamps, colorScale, this.dataCol);
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

    defaultCharts() {
        const tempChamps = this.champs.slice(0, this.champs.length);
        tempChamps.sort((a, b) => this.champData[b][parseInt(this.currYear) - 2011][this.dataCol] - this.champData[a][parseInt(this.currYear) - 2011][this.dataCol]);
        const slicey = tempChamps.slice(0, 5);
        this.colorScale = d3.scaleOrdinal()
        .domain([...slicey, "Other"])
        .range([...d3.schemeCategory10.slice(0, 5), '#808080']);
        
        this.lines.drawVisuals(slicey, this.colorScale, this.dataCol);
        this.waffle.drawWaffle(slicey, this.dataCol, this.currYear, this.colorScale);
    }
    
}