function refresh_comments_graph(term){

  Plotly.d3.csv("http://127.0.0.1:3000/timeseries/comments/?q="+term, function(err, rows){
    console.log(rows)
    function unpack(rows, key, sentiment) {
    return rows.filter(x => x['sentiment'] == sentiment).map(function(row) { return row[key]; });
  }

  console.log(rows);

  var trace1 = {
    type: "scatter",
    mode: "lines+markers",
    name: 'Negative sentiment',
    x: unpack(rows, 'timestamp', 'negative'),
    y: unpack(rows, 'count', 'negative'),
    line: {color: 'red', shape: 'hvh', 'simplify': true},
    marker: {color: 'red',size: 3, opacity: 0.5}
}

  var trace2 = {
    type: "scatter",
    mode: "lines+markers",
    name: 'Positive sentiment',
    x: unpack(rows, 'timestamp', 'positive'),
    y: unpack(rows, 'count', 'positive'),
    line: {color: 'green', shape: 'hvh', 'simplify': true},
    marker: {color: 'green',size: 3,opacity: 0.5}
  }

  var trace3 = {
    type: "scatter",
    mode: "lines+markers",
    name: 'Neutral sentiment',
    x: unpack(rows, 'timestamp', 'neutral'),
    y: unpack(rows, 'count', 'neutral'),
    line: {color: 'blue', shape: 'hvh', 'simplify': true},
    marker: {color: 'blue',size: 3,opacity: 0.5}
  }


  var data = [trace1,trace2,trace3];
      
  var layout = {
    title: 'Sentiments about ' + term, 
    xaxis: {
      autorange: false,
      range: ['2018-05-20', '2018-06-30'], 
      rangeselector: {buttons: [
          {
            count: 1, 
            label: '1m', 
            step: 'month', 
            stepmode: 'backward'
          }, 

          {
            count: 6, 
            label: '6m', 
            step: 'month', 
            stepmode: 'backward'
          }, 
          {step: 'all'}
        ]}, 
      rangeslider: {}, 
      type: 'date'
    }, 
    yaxis: {
      autorange: true,  
      type: 'linear'
    }
  };

  Plotly.newPlot('comments_graph', data, layout);
  document.getElementById('comments_graph').on('plotly_click', function(data){
      console.log(data)
  });



})



}