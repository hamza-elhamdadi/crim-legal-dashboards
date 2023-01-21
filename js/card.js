
class Card{
    constructor(data, base_data, id, card_title='No card title provided', card_text='No card subtitle provided', keys=[]){
        this.data = data;
        this.base_data = base_data;
        this.total = 'Cases Referred to the Prosecutor '
        this.id = id;
        this.title = card_title;
        this.text = card_text;
        this.keys = keys;
        this.fullMonths = {
            'Jan': 'January', 
            'Feb': 'February', 
            'Mar': 'March', 
            'Apr': 'April', 
            'May': 'May', 
            'Jun': 'June', 
            'Jul': 'July', 
            'Aug': 'August', 
            'Sep': 'September', 
            'Oct': 'October', 
            'Nov': 'November', 
            'Dec': 'December'
        }

        this.margin = {top: 30, right: 20, bottom: 20, left: 0}
    }

    buildCard(){
        let vis = this;
        let page = d3.select('#yolo')            

        let card = page.append('div')
                        .attr('id', vis.id)
                        .attr('class', 'card mx-auto shadow p-3 mb-5 bg-white rounded')
                        .style('width', '70%')
                        .style('margin', '10pt')
                
        card.append('h5')
                .attr('class','card-title')
                .text(vis.title)
        
        card.append('p')
                .attr('class','card-text')
                .text(vis.text)
        
        vis.totalWidth = 0.95*card.node().getBoundingClientRect().width
        vis.height = 90;

        vis.visWidth = (vis.totalWidth*0.6 - (vis.margin.left + vis.margin.right));
        vis.labelsWidth = (vis.totalWidth*0.4 - (vis.margin.left + vis.margin.right));

        vis.svg = card.append('g')
                    .style('text-align','center')
                    .append('svg')
                        .attr('width', vis.totalWidth)
                        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
    }

    drawVisMetadata(){
        let vis = this;
        vis.svg.append('text')
            .attr('x',vis.margin.left)
            .attr('y',vis.margin.top)
            .text('Total Cases')
                .style('font-weight',500)
                .style('font-size','12pt')
        
        vis.svg.append('text')
            .attr('id', `${vis.id}_month`)
            .attr('x',vis.margin.left)
            .attr('y',vis.margin.top + 20)
            .text('February 2022')
                .style('font-weight',500)
                .style('font-size','12pt')
        
        vis.svg.append('text')
            .attr('id', `${vis.id}_total`)
            .attr('x',vis.margin.left)
            .attr('y',vis.margin.top + 75)
            .text(vis.title.includes('Diverted') ? `${Math.round(80/340*100)}%` : `${Math.round(80/340*100)}%`)
                .style('font-weight',500)
                .style('font-size','35pt')
        
        vis.numberWidth = BrowserText.getWidth(vis.title.includes('Diverted') ? `${Math.round(80/340*100)}%` : `${Math.round(80/340*100)}%`,35,'Helvetica Neue')
        
        vis.svg.append('g')
            .selectAll('text')
            .data(['Cases',vis.title.includes('Diverted') ? 'Diverted' : 'Sentenced'])
            .enter()
                .append('text')
                .attr('id', (d,i) => `${vis.id}_total_subtitle${i}`)
                .attr('x',vis.margin.left + vis.numberWidth + 10)
                .attr('y',(d,i) => vis.margin.top + i*20 + 55)
                .text(d => d)
                    .style('font-weight',200)
                    .style('font-size','14pt')
    }

    drawLineChart(){
        let vis = this;
        vis.relevantData = vis.data.filter(d => +d.Date.replace("'",'').split(' ')[1] > 20)

        vis.x_axis = d3.scaleTime()
            .domain([new Date(2021, 1), new Date(2022, 1)])
            .range([0,vis.visWidth])
        
        vis.y_axis = d3.scaleLinear()
            .domain([0,d3.max(vis.data.map(d => {
                console.log(vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total])
                return Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)
            }))])
            .range([vis.height,0])

        vis.gridlines = vis.svg.append('g')
            .selectAll('line')
            .data([0, 100])
            .enter()
            
        vis.gridlines.append('line')
                .attr('transform',`translate(0,${vis.margin.top})`)
                .attr('x1', vis.margin.left + vis.totalWidth*0.3)
                .attr('y1', d => {
                    return vis.y_axis(d)
                })
                .attr('x2', vis.totalWidth-vis.margin.right)
                .attr('y2', d => vis.y_axis(d))
                .attr('stroke', 'lightgrey')
                .attr('stroke-width', 1)
        
        vis.gridlines.append('text')
                .attr('transform',`translate(0,${vis.margin.top})`)
                .attr('x', vis.margin.left + vis.totalWidth*0.28)
                .attr('y', d => {
                    return vis.y_axis(d)
                })
                .text(d => d)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 300)
                .attr('font-size', '11pt')

        vis.svg.append('g')
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top})`)
                .append('path')
                .datum(vis.relevantData)
                .attr('fill','none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 4)
                .attr('d', d3.line()
                    .x(d => {
                        let [mo,yr] = d.Date.split(' ')
                        mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(mo) / 3;
                        yr = +yr.replace("'",'20')
                        //console.log(vis.x_axis(new Date(yr,mo)))
                        return vis.x_axis(new Date(yr,mo))
                    })
                    .y(d => {
                        return vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100))
                    })
                )
            
            vis.svg.append('g')
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top})`)
                .selectAll('circle')
                .data(vis.relevantData)
                .enter()
                .append('circle')
                    .attr('cx', d => {
                        let [mo,yr] = d.Date.split(' ')
                        mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(mo) / 3;
                        yr = +yr.replace("'",'20') 
                        return vis.x_axis(new Date(yr,mo))
                    })
                    .attr('cy', d => {
                        return vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100))
                    })
                    .attr('r', 4)
                    .attr('fill','white')
                    .attr('stroke','steelblue')
                    .attr('stroke-width',1)
        
        
        vis.overlays = vis.svg.selectAll('overlay')
            .data(vis.relevantData)
            .enter()
            .append('g')
            .attr('class', 'g_event')
        
        vis.overlays.on('mouseover', function(e,d){
            d3.select(`#${vis.id}_infor_24`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infov_24`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infod_24`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infoc_24`).style('visibility', 'hidden')

            d3.select(`#${vis.id}_infor_${d.index}`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infov_${d.index}`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infod_${d.index}`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infoc_${d.index}`).style('visibility', 'visible')

            let innerText = `${Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)}%`
            let selectedMonth = `${vis.fullMonths[d.Date.split(' ')[0]]} ${d.Date.split(' ')[1].replace("'", '20')}`

            d3.select(`#${vis.id}_total`).text(innerText)
            d3.select(`#${vis.id}_month`).text(selectedMonth)

            vis.numberWidth = BrowserText.getWidth(innerText,35,'Helvetica Neue')

            for(let i = 0; i < 2; i++){
                d3.select(`#${vis.id}_total_subtitle${i}`)           
                    .attr('x',vis.margin.left + vis.numberWidth + 10)
            }
            

        })
        .on('mouseout', function(e,d){
            d3.select(`#${vis.id}_infor_${d.index}`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infov_${d.index}`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infod_${d.index}`).style('visibility', 'hidden')
            d3.select(`#${vis.id}_infoc_${d.index}`).style('visibility', 'hidden')
            
            d3.select(`#${vis.id}_infor_24`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infov_24`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infod_24`).style('visibility', 'visible')
            d3.select(`#${vis.id}_infoc_24`).style('visibility', 'visible')

            d3.select(`#${vis.id}_total`).text('24%')
            d3.select(`#${vis.id}_month`).text('February 2022')

            vis.numberWidth = BrowserText.getWidth('24%',35,'Helvetica Neue')

            for(let i = 0; i < 2; i++){
                d3.select(`#${vis.id}_total_subtitle${i}`)    
                    .attr('x',vis.margin.left + vis.numberWidth + 10)
            }
        })
        
        vis.overlays.append('rect')
            .attr('id', d => `${vis.id}_infor_${d.index}`)
            .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
            .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},0)`)
            .attr('x', (d,i) => (i-1.5)*vis.visWidth/12)
            .attr('y', 0)
            .attr('width', vis.visWidth/12)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom*0.3)
            .attr('fill', 'grey')   
            .attr('stroke', 'none')
            .attr('opacity', 0.2)
            
        
        vis.overlays.append('text')
                .attr('id', d => `${vis.id}_infov_${d.index}`)
                .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top*2/3})`)
                .attr('x', d => {
                    let [mo,yr] = d.Date.split(' ')
                    mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(mo) / 3;
                    yr = +yr.replace("'",'20')
                    return vis.x_axis(new Date(yr,mo))-13
                })
                .attr('y', 0)
                .text(d => `${Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)}%`)
                .style('font-weight', 200)
                .style('font-size', '10pt')
        
        vis.overlays.append('text')
                .attr('id', d => `${vis.id}_infod_${d.index}`)
                .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.height+vis.margin.top+vis.margin.bottom*5/6})`)
                .attr('x', (d,i) => {
                    let [mo,yr] = d.Date.split(' ')
                    mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(mo) / 3;
                    yr = +yr.replace("'",'20')
                    return vis.x_axis(new Date(yr,mo))-20
                })
                .attr('y', 0)
                .text(d => d.Date)
                .style('font-weight', 200)
                .style('font-size', '10pt')

        vis.overlays.append('circle')
                .attr('id', d => `${vis.id}_infoc_${d.index}`)
                .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top})`)
                .attr('cx', d => {
                    let [mo,yr] = d.Date.split(' ')
                    mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(mo) / 3;
                    yr = +yr.replace("'",'20') 
                    return vis.x_axis(new Date(yr,mo))
                })
                .attr('cy', d => {
                    return vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100))
                })
                .attr('r', d => d.index === 24 ? 8 : 6)
                .attr('fill','lightblue')
                .attr('stroke','steelblue')
                .attr('stroke-width',2)
    }

    drawBarChart(){
        let vis = this;
        vis.relevantData = vis.data.filter(d => +d.Date.replace("'",'').split(' ')[1] > 20)

        vis.x_axis = d3.scaleBand()
            .domain(vis.relevantData.map(d => d.Date))
            .range([0,vis.visWidth])

        vis.y_axis = d3.scaleLinear()
            .domain([0,d3.max(vis.data.map(d => Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)))])
            .range([vis.height,0])
        
        vis.gridlines = vis.svg.append('g')
            .selectAll('line')
            .data([0, 100])
            .enter()
            
        vis.gridlines.append('line')
                .attr('transform',`translate(0,${vis.margin.top})`)
                .attr('x1', vis.margin.left + vis.totalWidth*0.3)
                .attr('y1', d => {
                    return vis.y_axis(d)
                })
                .attr('x2', vis.totalWidth-vis.margin.right)
                .attr('y2', d => vis.y_axis(d))
                .attr('stroke', 'lightgrey')
                .attr('stroke-width', 1)
        
        vis.gridlines.append('text')
                .attr('transform',`translate(0,${vis.margin.top})`)
                .attr('x', vis.margin.left + vis.totalWidth*0.28)
                .attr('y', d => {
                    return vis.y_axis(d)
                })
                .text(d => d)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 300)
                .attr('font-size', '11pt')  
                
        
        vis.svg.selectAll("bars")
            .data(vis.relevantData)
            .join("rect")
                .attr('id', d => `${vis.id}_bar_${d.index}`)
                .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top})`)
                .attr("x", d => vis.x_axis(d.Date))
                .attr("y", d => {
                    return vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100))
                })
                .attr("width", vis.x_axis.bandwidth()*0.8)
                .attr("height", d => {
                    return vis.height - vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)) 
                })
                .attr("fill", d => d.index === 24 ? 'steelblue' : "white")
                .attr('stroke', 'steelblue')
                .on('mouseover', function(e,d){
                    d3.select(`#${vis.id}_infod_24`)
                        .style('visibility', 'hidden')
                    d3.select(`#${vis.id}_infov_24`)
                        .style('visibility', 'hidden')
                    d3.select(`#${vis.id}_label_24`)
                        .style('visibility', 'hidden')
                    
                    d3.select(`#${vis.id}_bar_24`)
                        .attr('fill', 'white')

                    let innerText = `${Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)}%`
                    let selectedMonth = `${vis.fullMonths[d.Date.split(' ')[0]]} ${d.Date.split(' ')[1].replace("'", '20')}`

                    d3.select(`#${vis.id}_total`).text(innerText)
                    d3.select(`#${vis.id}_month`).text(selectedMonth)
                    d3.select(this).attr("fill", "steelblue")

                    vis.numberWidth = BrowserText.getWidth(innerText,35,'Helvetica Neue')

                    for(let i = 0; i < 2; i++){
                        d3.select(`#${vis.id}_total_subtitle${i}`)           
                            .attr('x',vis.margin.left + vis.numberWidth + 10)
                    }
                
                    d3.select(`#${vis.id}_infod_${d.index}`)
                        .style('visibility', 'visible')
                    d3.select(`#${vis.id}_infov_${d.index}`)
                        .style('visibility', 'visible')
                })
                .on("mouseout", function(e,d){
                    
                    
                    console.log(`#${vis.id}_bar_24`)
                    

                    d3.select(`#${vis.id}_total`).text(`24%`)
                    d3.select(`#${vis.id}_month`).text('February 2022')
                    d3.select(this).attr("fill", "white")
                    
                    
                    

                    vis.numberWidth = BrowserText.getWidth('24%',35,'Helvetica Neue')

                    for(let i = 0; i < 2; i++){
                        d3.select(`#${vis.id}_total_subtitle${i}`)    
                            .attr('x',vis.margin.left + vis.numberWidth + 10)
                    }

                    d3.select(`#${vis.id}_label_${d.index}`)
                        .style('visibility', 'hidden')

                    d3.select(`#${vis.id}_infod_${d.index}`)
                        .style('visibility', 'hidden')
                    
                    d3.select(`#${vis.id}_infov_${d.index}`)
                        .style('visibility', 'hidden')

                    d3.select(`#${vis.id}_label_24`)
                        .style('visibility', 'visible')

                    d3.select(`#${vis.id}_infod_24`)
                        .style('visibility', 'visible')
                
                    d3.select(`#${vis.id}_infov_24`)
                        .style('visibility', 'visible')
                    
                    d3.select(`#${vis.id}_infod_24`)
                        .style('visibility', 'visible')

                    d3.select(`#${vis.id}_bar_24`)
                        .attr('fill', 'steelblue')
                })

        console.log(vis.relevantData)
        
        vis.svg.selectAll('dates')
                .data(vis.relevantData)
                .enter()
                    .append('text')
                        .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
                        .attr('id', d => `${vis.id}_infod_${d.index}`)
                        .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.height+vis.margin.top+vis.margin.bottom*5/6})`)
                        .attr('x', (d,i) => {
                            return vis.x_axis(d.Date) - 9
                        })
                        .attr('y', 0)
                        .text(d => d.Date)
                        .style('font-weight', 200)
                        .style('font-size', '10pt')
        
        vis.svg.selectAll('values')
                .data(vis.relevantData)
                .enter()
                    .append('text')
                        .style('visibility', d => d.index === 24 ? 'visible' : 'hidden')
                        .attr('id', d => `${vis.id}_infov_${d.index}`)
                        .attr('transform',`translate(${vis.margin.left+vis.labelsWidth},${vis.margin.top})`)
                        .attr('x', (d,i) => {
                            return vis.x_axis(d.Date)+6
                        })
                        .attr('y', d => vis.y_axis(Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)) - 7)
                        .text(d => `${Math.round(d[vis.keys]/vis.base_data.filter(obj => obj.Date == d.Date)[0][vis.total]*100)}%`)
                        .style('font-weight', 300)
                        .style('font-size', '10pt')

        
    }
}
