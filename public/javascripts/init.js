
var current_date = new Date()
var var_date = new Date()

function init(){

      var from_date_input=$('input[name="from-date"]'); //our date input has the name "date"
      var to_date_input=$('input[name="to-date"]'); //our date input has the name "date"
            
      var options={
        format: 'mm-dd-yyyy',
        todayHighlight: true,
        autoclose: true,
      };

      from_date_input.datepicker(options);
      to_date_input.datepicker(options);

      //set current date
      to_date_input.datepicker('setDate', current_date);

      // go back 2 weeks
      var_date.setDate(var_date.getDate() - 14)
      from_date_input.datepicker('setDate',  var_date)

      $('#watchwords').tagsinput('add', 'duterte');
      $('#watchwords').tagsinput('add', 'drugs');
      $('#watchwords').tagsinput('add', 'critics');  

      $('#watchwords').on('itemAdded', function(event) {
          words = $('#watchwords').val();
          words = words.replace(/,/g, ',')
          console.log(words)
          update_d3_graph(words);
      });

         $('#watchwords').on('itemRemoved', function(event) {
          words = $('#watchwords').val();
          words = words.replace(/,/g, ',')
          console.log(words)
          update_d3_graph(words);
      });
      // init_data_table()

      // result = httpGetAsync('http://localhost:3002/posts/summary?q=*&from=2018-07-01&to=2018-07-11',
      // 	function(data){
      // 		rows = JSON.parse(data)['data']['summary']
      // 		console.log(rows)
      // 		insert_rows(summary_table, rows.map( 
      // 			function(d){

      // 				image = d[13	]
      // 				link = d[14]	
      // 				if(image != "" && image != null){
      // 					image = "<img src='" + image + "' style='height:100px; width:100px'>"
      // 				}

      // 				if(link != "" && link != null){
      // 					link = "<a target='_blank' href='" + link + "'>" + link + "</a>"
      // 				}
      // 				return [d[11],image, d[3], d[5], d[9], d[8], d[10], link]

      // 			})
      // 		)

      // 	})

      // result = httpGetAsync('http://localhost:3002/comments/summary?q=duterte',
      //   function(data){
      //     rows = JSON.parse(data)['data']['summary']
      //     console.log(rows)
      //     console.log('***')
      //     insert_rows(comments_table, rows.map( 
      //       function(d){

      //         image = d[2]
      //         link = d[8]  
      //         if(image != "" && image != null){
      //           image = "<img src='" + image + "' style='height:100px; width:100px'>"
      //         }

      //         if(link != "" && link != null){
      //           link = "<a target='_blank' href='" + link + "'>" + link + "</a>"
      //         }
      //         return [d[0], d[1], d[3], image, d[6], d[7], d[5], d[4], link]

      //       })
      //     )

      //   })

    // draw_wordcloud();
    init_graph();

   input_terms = ['duterte', 'critics', 'drugs']
	  update_d3_graph(input_terms);

    // refresh_comments_graph('duterte');
}

function draw_wordcloud(){
	result = httpGetAsync('http://localhost:3002/posts/wordcloud?q=*&from=2018-07-01&to=2018-07-11',
      	function(data){
      		data = JSON.parse(data)['data']
      		data = data.map(function(d){return {'text':d[0], 'size': d[1]}})
      		console.log(data)
      		var frequency_list = data

 			 d3.layout.cloud().size([1000, 300])
	            .words(frequency_list)
	            .rotate(0)
	            .fontSize(function(d) { return d.size/2; })
	            .on("end", draw)
	            .start();
      });



function draw(words) {
	   var color = d3.scaleLinear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

  
        d3.select("#word-cloud").append("svg")
                .attr("width", 1000)
                .attr("height", 300)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size/2 + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }

}