//function to populate the #sample-metadata on the html index
//metadata is the demographic info on the page
function populateDemographic(subject)
{
//load the data on json file, pulling data.metadata into subjectDemoInfo
    d3.json("samples.json").then((data) =>{
        let subjectDemoInfo = data.metadata;
//filter subjectDemoInfo based on the subjects
        let response = subjectDemoInfo.filter(subjectList => subjectList.id == subject);
//access the first subject data 
        let responseList = response[0];
//clear the output
        d3.select("#sample-metadata").html("");
//populate the demographic info with value key pairs
        Object.entries(responseList).forEach(([key,value]) => {
//append the info obtained to the id #sample-metadata on the html index
        d3.select("#sample-metadata")
//text added as h6 heading
            .append("h6").text(`${key}:${value}`);  
        });
});
}
//functions to create the charts
//start with function to create bar chart
function createBar(subject)
{
//load the data on json file, pulling data.samples into barInfo
    d3.json("samples.json").then((data) =>{
        let barInfo = data.samples;
//filter barInfo based on the subjects
        let response = barInfo.filter(subjectList => subjectList.id == subject);
//access the first subject data 
        let responseList = response[0];
//create the bar chart with top 10 OTUs
//create chart horizontally
        let barChart = {
// sample_values are the operational taxonomic units values
// sample_values are the x values
                x: (responseList.sample_values).slice(0,10).reverse(),
// otu_ids are the operational taxonomic units ids
// otu_ids are the yticks
                y: (responseList.otu_ids).slice(0,10).map(id => `OTU ${id}`).reverse(),
// otu_labels are the operational taxonomic units labels
// otu_labels are the text values
                text: (responseList.otu_labels).slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
    }
//set the layout
        let layoutBar ={
            title : "Top 10 Belly Button Bacteria"
    }
//call Plotly to render the bar chart 
        Plotly.newPlot("bar",[barChart], layoutBar);
    })
}
//function to create bubble chart
function createBubble (subject) {
//load the data on json file, pulling data.samples into bubbleInfo
    d3.json("samples.json").then((data) =>{
        let bubbleInfo = data.samples;
//filter bubbleInfo based on the subjects
        let response = bubbleInfo.filter(subjectList => subjectList.id == subject);
//access the first subject data 
        let responseList = response[0];
//create the bubble chart
        let bubleChart = {
// otu_ids are the operational taxonomic units ids
// otu_ids are the x values
            x: responseList.otu_ids,
// sample_values are the operational taxonomic units values
// sample_values are the y values 
            y: responseList.sample_values,
// otu_labels are the operational taxonomic units labels
// otu_labels are the text values    
            text: responseList.otu_labels,
            mode: "markers",
            marker: {
                size: responseList.sample_values,
                color: responseList.otu_ids,
                colorscale: "Bluered"
            }
        }
//set the layout
        let layoutBubble = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "Operational Taxonomic Units (OTU) ID"}
        };
//call Plotly to render the bubble chart 
        Plotly.newPlot("bubble",[bubleChart], layoutBubble);
        })  
}
//function to start the dashboard 
function startDashboard()
{
//access the dropdown id #selDataset on the html index
    var dropdown  = d3.select("#selDataset");
//load the data on json file, pulling data.names as the dropdown id
    d3.json("samples.json").then((data) =>{
        let dropdownIds= data.names;
//append the subjects info to the ids on #selDataset html         
        dropdownIds.forEach((subject) => {
            dropdown.append("option")
            .text(subject)
            .property("value", subject);
        });
//access the first subject data 
        let startSubject = dropdownIds[0];
//call the functions to start the dashboard
        populateDemographic(startSubject); 
        createBar(startSubject);
        createBubble(startSubject);
        });    
}
//function to update the dashboard
function optionChanged(subject)
{
    populateDemographic(subject);
    createBar(subject);
    createBubble(subject);
}
//call the startDashboard function
startDashboard();
