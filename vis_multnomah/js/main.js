
const data = ['Cases that are Diverted', 'Cases that End with a Sentence']

Promise.all(data.map(file => d3.csv(`data/${file}.csv`, (row,i) => {
    Object.keys(row).forEach(key => {
        row[key] = key.includes('Warning') || key.includes('Date') ? row[key] : +row[key];
    })
    row.index = i;
    return row;
})))
    .then(data_list => {
        let ycards = [];
        for(let i = 0; i < data.length; i++){
            let ycard = new MultnomahCard(data_list[i], ids[i],  data[i], texts[i])
            ycard.buildVis()
            //ycard.drawVisMetadata()
            //ycard.drawVis()
            ycards.push(ycard)
        }
    })