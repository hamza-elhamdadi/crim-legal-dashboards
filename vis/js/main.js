
const data = ['Cases that are Diverted', 'Cases that End with a Sentence']
const texts = [
    'This section is about cases that are enrolled in a pretrial diversion program instead of being prosecuted. Pretrial diversion programs offer eligible defendants a chance to avoid charges, incarceration, or a criminal record, provided the programs are completed. They often address needs such as mental health, addiction, and homelessness.',
    'This section is about cases that end in a sentence. After conviction, and depending on the seriousness of the offense, an individual will be sentenced to death, prison, jail, probation, monetary penalties such as restitution and fines, or to other penalties such as community service.'
]
const ids = ['divert','sentence']

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
            let ycard = new YoloCard(data_list[i], ids[i],  data[i], texts[i])
            ycard.buildCard()
            ycard.drawVisMetadata()
            ycard.drawVis()
            ycards.push(ycard)
        }
    })