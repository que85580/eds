import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

/*const {Countries,Capital,Continent,Currency, 
    allCountries,abbreviation,Africa,SouthAmerica,NorthAmerica
    	,Asia,Australia,capital,continent,countries,Europe,SNo} = placeholders;*/
       

const {SNo,Capital,Continent,Countries,Currency, Oceania,asia,europe,africa,northAmerica,southAmerica,Africa,SouthAmerica,NorthAmerica
                ,Asia,Australia,Europe,SERILNO,CAPITAL,CONTINENT,COUNTRIES,CURRENCY} = placeholders;

/*
{
      "S.No": "1",
      "Capital": "Kabul",
      "Continent": "Asia",
      "Countries": "Afghanistan",
      "Currency": "Afghani"
    },
    */

async function createTableHeader(table){
    let tr=document.createElement("tr");
    let sno=document.createElement("th");
    let conuntry=document.createElement("th");
    let continenth=document.createElement("th");
    let capitalh=document.createElement("th");
    let abbr=document.createElement("th");
    capitalh.appendChild(document.createTextNode("CAPITAL"));
    continenth.appendChild(document.createTextNode("CONTINENT"));
    conuntry.appendChild(document.createTextNode("COUNTRIES"));
    sno.appendChild(document.createTextNode("S-NO"));
    abbr.appendChild(document.createTextNode("CURRENCY"));
    tr.append(sno);
    tr.append(conuntry);
    tr.append(continenth);
    tr.append(capitalh);
    tr.append(abbr);
    table.append(tr);
}


async function createTableRow(table,row,i){
    let tr=document.createElement("tr");
    let sno=document.createElement("td");
    let conuntry=document.createElement("td");
    let continent=document.createElement("td");
    let capital=document.createElement("td");
    let abbr=document.createElement("td");
    sno.appendChild(document.createTextNode(i));
    conuntry.appendChild(document.createTextNode(row.Countries));
    continent.appendChild(document.createTextNode(row.Capital));
    capital.appendChild(document.createTextNode(row.Continent));
    abbr.appendChild(document.createTextNode(row.Currency));
    tr.append(sno);
    tr.append(conuntry);
    tr.append(continent);
    tr.append(capital);
    tr.append(abbr);
    table.append(tr);
}




async function createSelectMap(jsonURL){
    const optionsMap=new Map();
    const { pathname } = new URL(jsonURL);

    const resp = await fetch(pathname);
    debugger;
    optionsMap.set("all","allCountries");
    optionsMap.set("Oceania",Australia);
    optionsMap.set("asia",Asia);
    optionsMap.set("europe",Europe);
    optionsMap.set("africa",Africa);
    optionsMap.set("northAmerica",NorthAmerica);
    optionsMap.set("southAmerica",SouthAmerica);
   // optionsMap.set("Australia","Oceania");
    const select=document.createElement('select');
    select.id = "region";
    select.name="region";
    optionsMap.forEach((val,key) => {
        debugger;
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.append(option);
      });
     
     const div=document.createElement('div'); 
     div.classList.add("region-select");
     div.append(select);
    return div;
}
async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
    }
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON=====> {} ",json);
    
    const table = document.createElement('table');
    debugger;
    createTableHeader(table);
    json.data.forEach((row,i) => {

        createTableRow(table,row,(i+1));

      
    });
    
    return table;
}    

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    console.log(countries)
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    const dropdown=document.getElementById('region');
      dropdown.addEventListener('change', () => {
        let url=countries.href;
        if(dropdown.value!='all'){
            url=countries.href+"?sheet="+dropdown.value;
        }
        const tableE=parientDiv.querySelector(":scope > table");
        let promise = Promise.resolve(createTable(url,dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
      });
  }