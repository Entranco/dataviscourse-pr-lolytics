class Table {
    constructor(champData, years, champs, datemap) {
        this.years = years;
        this.champData = champData;
        this.champs = champs;
        this.currYear = 2022
        this.datemap = datemap

        d3.select("#select-button")
            .selectAll('myOptions')
            .data(this.years)
            .enter()
            .append('option')
            .text(d => d)
            .attr("value", d => d)

        d3.select("#select-button").on("change", d => {
            let option = d3.select("#select-button").property("value")
            this.currYear = parseInt(option)
            this.drawTable()
        })

        this.drawTable()
    }

    drawTable() {
        let rowSelection = d3.select('#table-body')
            .selectAll('tr')
            .data(this.datemap[this.currYear])
            .join('tr');

        let statSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr("id", d => d.id)
        
        statSelection.filter(d => d.type === "text").text(d => d.value)
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
}