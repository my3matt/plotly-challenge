
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data
    var resultArray = metadata.filter(sampleVal => sampleVal.id == sample);
    var result = resultArray[0];
    //sample metadata panel
    var PANEL = d3.select("#sample-metadata");
      //clear
    PANEL.html("");

   //append panel with values
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    //define variables for charts
    var samples = data.samples;
    //filter data using sample filter created
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Belly Bacteria Diversity",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 45}
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Inferno"
        }
      }
    ];
    //plot
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    //Prep bar chart by slicing 10 example highest vals 
    //slice vals to order greatest to least
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    //data type modifications
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        
      }
    ];
    //modify aesthetics 
    var barLayout = {
      title: "Top 10 Bacterium",
      margin: { t: 60, l: 130 }
      
    };
    //plot
    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  // dropdown select
  var selector = d3.select("#selDataset");

  // populate select using sample data
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // first samples for plot
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
  //next sample data
function optionChanged(nextSample) {
  // Fetch new data 
  buildCharts(nextSample);
  buildMetadata(nextSample);
}

// Initialize the dashboard
init();
