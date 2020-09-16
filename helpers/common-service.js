//Filter Data 
exports.sortData = (data) => {
    //filter the data
    
    //!!!!!!OR OPTIONS We Have Also Implement By Take Array And Push The Specific Value On That
    for(i=0;i<data.Countries.length;i++)
    {
        let totalactive=data.Countries[i].TotalConfirmed-data.Countries[i].TotalRecovered-data.Countries[i].TotalDeaths;
        data.Countries[i].TotalActiveCase = totalactive
        delete data.Countries[i].CountryCode
        delete data.Countries[i].Slug
        delete data.Countries[i].NewConfirmed
        delete data.Countries[i].NewDeaths
        delete data.Countries[i].NewRecovered
        delete data.Countries[i].Premium
    }
    return data.Countries;
}