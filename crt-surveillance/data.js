// this file reads the dataset, and converts the names of countries into coordinates, putting it into a csv file with 4 columns: long1, lat1, long2, lat2
// SIPRIS contains data between 1950-2023
// https://armstransfers.sipri.org/ArmsTransfer/
// SIPRI TIV is value in millions of $


const data_path = "data/trade-register.csv";

class Country {
    constructor(name, volume){
        this.name = name;
        this.volume = volume;
    }
}

let countries = [];

d3.csv(data_path, function(data) {
    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].Recipient);
        // console.log(data[i].SIPRI_TIV_of_delivered_weapons);
        let found = false;
        for(var j = 0; j < countries.length; j++){
            if(countries[j].name == data[i].Recipient){
                countries[j].volume += parseFloat(data[i].SIPRI_TIV_of_delivered_weapons);
                found = true;
                break;
            }
        }
        if(!found) countries.push(new Country(data[i].Recipient, parseFloat(data[i].SIPRI_TIV_of_delivered_weapons)));
    }
    console.log(countries)
});

