const loadData = () => {
  fetch('/api/v1/query')
    .then( response => {
      if (response.status !== 200) {
        console.log(response);
      }
      return response;
    })
    .then(response => response.json())
    .then(parsedResponse => {
      // console.log( parsedResponse)
      const unpackData = (arr, key) => {
        if (key=== 'time') 
            return arr.time
        if (key=== 'data') 
            return arr.data
        // return arr.map(obj => obj[key])
      }
      const firstTrace = {
        type: 'scatter',
        mode: 'lines',
        name: '2fr',
        x: unpackData(parsedResponse, 'time'),
        y: unpackData(parsedResponse, 'data'),
        line: {color: '#17BECF'}
      }
      const secondTrace = {
        type: "scatter",
        mode: "lines",
        name: 'other Data',
        x: unpackData(parsedResponse, 'time'),
        y: unpackData(parsedResponse, 'data'),
        line: {color: '#17BECF'}
      }
      const data = [firstTrace, secondTrace];
      const layout = {
        title: 'Local CPU Usage',
      };
      return Plotly.newPlot('graphs-container', data, layout);
    })
    .catch( error => console.log(error) );
}

$(window).on('load', loadData);
