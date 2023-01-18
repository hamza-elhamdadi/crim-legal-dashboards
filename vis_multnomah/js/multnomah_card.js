class MultnomahCard{
    constructor(data, id, card_title='No card title provided', card_text='No card subtitle provided'){
        this.data = data;
        this.id = id;
        this.title = card_title;
        this.text = card_text;
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

        this.margin = {top: 10, right: 10, bottom: 10, left: 10}
    }

    buildVis(){
        let vis = this;
        let page = d3.select('#multnomah')

        let card = page.append()
    }
}