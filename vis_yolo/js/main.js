
const data = ['Cases that are Diverted', 'Cases that End with a Sentence']

Promise.all(data.map(file => d3.csv(`data/${file}.csv`, (row,i) => {
    Object.keys(row).forEach(key => {
        row[key] = key.includes('Warning') || key.includes('Date') ? row[key] : +row[key];
    })
    row.index = i;
    return row;
})))
    .then(data_list => {
        console.log(data_list)
    })