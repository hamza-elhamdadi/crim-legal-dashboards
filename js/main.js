
const metadata = [
    {
        title: 'Cases Referred to the Prosecutor'
    },
    {
        id: 'divert',
        key: 'Cases Diverted ',
        title: 'Cases that Are Diverted',
        text: {
            none: [''],
            short: ['This section presents information on the percentage of cases that are enrolled in a pretrial diversion program instead of being prosecuted. Pretrial diversion programs offer eligible defendants a chance to avoid charges, incarceration, or a criminal record, provided the programs are completed. They often address needs such as mental health, addiction, and homelessness. Data from February 2021 through January 2022.'],
            long: [
                    'This section presents information on the percentage of cases that are enrolled in a pretrial diversion program instead of being prosecuted. Pretrial diversion programs offer eligible defendants a chance to avoid charges, incarceration, or a criminal record, provided the programs are completed. They often address needs such as mental health, addiction, and homelessness.', 
                    'To participate in diversion, an accused is typically evaluated by a clinician who can recommend treatment to address the underlying cause of criminality. This may happen prior to arraignment, with the option to avoid any criminal record, or after arraignment, with the option to avoid trial and, if found guilty, conviction. The accused accesses services from a community provider, with court oversight. If the accused is compliant in the treatment program, prosecutors may choose to drop charges or impose a different non-conviction option.',
                    'The percentage of cases that are diverted is calculated by dividing the number of diverted cases by the total number of cases the office handles in a given month. Monthly data from February 2021 through January 2022 shown.'
            ]
        },
    },
    {
        id: 'sentence',
        key: 'Cases Sentenced ',
        title: 'Cases that End with a Sentence',
        text: {
            none: [''],
            short: ['This section presents information on the percentage of cases that are sentenced following prosecution. After conviction, and depending on the seriousness of the offense, an individual will be sentenced to death, prison, jail, probation, assigned monetary penalties, such as restitution and fines, or other penalties, such as community service. Data from February 2021 through February 2022.'],
            long: [
                    'This section presents information on the percentage of cases that are sentenced following prosecution.The specific sentence imposed will depend on the nature of the crime, the circumstances of the case, and the applicable laws in the jurisdiction where the case was tried.',
                    'Sentencing typically takes place after conviction. Depending on the seriousness of the offense, an individual will be sentenced to death, prison, jail, probation, assigned monetary penalties, such as restitution and fines, or other penalties, such as community service. After completing their sentence, or if they are released early, the defendant may be placed on court-supervised probation.',
                    'The percentage of cases that are sentenced is calculated by dividing the number of diverted cases by the total number of cases the office handles in a given month. Monthly data from February 2021 through February 2022 shown.'
                ]
        }
    }
]

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


function generateVisualization(num_vis, length, selector, questionText){
    Promise.all(metadata.map(file => d3.csv(`https://hamza-elhamdadi.github.io/crim-legal-dashboards/data/${file.title}.csv`, (row,i) => {
        Object.keys(row).forEach(key => {
            row[key] = key.includes('Warning') || key.includes('Date') ? row[key] : +row[key];
        })
        row.index = i;
        return row;
    })))
        .then(data_list => {
            let ycards = [];
            for(let i = 0; i < metadata.length-1; i++){
                let ycard = new Card(data_list[i+1], data_list[0], metadata[i+1], length)
                
                if(i == 0 || num_vis==1) {
                    ycard.buildCard(num_vis, 'line', selector)
                    ycard.drawLineChart()
                } else {
                    ycard.buildCard(num_vis, 'bar', selector)
                    ycard.drawBarChart()
                }
                ycard.drawVisMetadata()
                ycards.push(ycard)
            }
            if(questionText) addQuestion(selector, questionText)
        })
}

// generateVisualization(2,'long',null,'<b>test</b>')