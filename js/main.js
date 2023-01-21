
const data = ['Cases Referred to the Prosecutor','Cases that are Diverted', 'Cases that End with a Sentence']
const texts = [
    'This section presents information on the number/percentage of cases that are enrolled in a pretrial diversion program instead of being prosecuted. Pretrial diversion programs offer eligible defendants a chance to avoid charges, incarceration, or a criminal record, provided the programs are completed. They often address needs such as mental health, addiction, and homelessness. Data from Feb 2021 to Feb 2022 are shown. Data are updated approximately yearly.',
    'This section presents information on the number/percentage of cases that end in a sentence. After conviction, and depending on the seriousness of the offense, an individual will be sentenced to death, prison, jail, probation, monetary penalties such as restitution and fines, or to other penalties such as community service. Data from Feb 2021 to Feb 2022 are shown. Data are updated approximately yearly.'
]
const ids = ['divert','sentence']

const keys = [
    [
        'Cases Diverted to Restorative Justice Partnership ',
        'Cases Diverted to Mental Health Court ',
        'Cases Diverted to Addiction Intervention Court ',
        'Cases Diverted to Steps to Success ',
        'Cases Diverted to Center for Intervention ',
        'Cases Diverted to a PC1000 Drug Diversion Program ',
        'Cases Diverted to Harm Reduction Drug Diversion ',
        'Cases Diverted to Deferred Entry of Judgment ',
        'Cases Diverted to Department of State Hospitals ',
        'Cases Diverted to Mental Health Diversion ',
        'Cases Diverted to Another Diversion '
    ],
    [
        'Cases Sentenced to Death Penalty ',
        'Cases Sentenced to Life in Prison without Parole ',
        'Cases Sentenced to State Prison ',
        'Cases Sentenced to County Jail ',
        'Cases Sentenced to Split Sentence ',
        'Cases Sentenced to Probation ',
        'Cases Sentenced to Other Sentences ',
    ]
]

const keys_simple = ['Cases Diverted ', 'Cases Sentenced ']

Promise.all(data.map(file => d3.csv(`data/${file}.csv`, (row,i) => {
    Object.keys(row).forEach(key => {
        row[key] = key.includes('Warning') || key.includes('Date') ? row[key] : +row[key];
    })
    row.index = i;
    return row;
})))
    .then(data_list => {
        let ycards = [];
        for(let i = 0; i < data.length-1; i++){
            let ycard = new Card(data_list[i+1], data_list[0], ids[i],  data[i+1], texts[i], keys_simple[i])
            ycard.buildCard()
            ycard.drawVisMetadata()
            //ycard.drawLineChart()
            if(i == 0) ycard.drawLineChart()
            else ycard.drawBarChart()
            ycards.push(ycard)
        }
    })