
var summary_table = null;
var comments_table = null;

var options = 
    { 
       'scrollX':        true,
       "pageLength": 10,
       "order": [[ 4, "desc" ]],
       "fixedColumns": true,
        "fixedHeader": {
            "header": true,
            "footer": true }, 
        "columnDefs": [
          { width: 100, targets: 0 },
         	{ width: 100, targets: 0 },
         	{ width: 1000, targets: 0 }
            
              
        ],
    };

function init_data_table(){
	    summary_table = $('#summary').DataTable(options);
      comments_table = $('#comments_table').DataTable(options);


}

function insert_rows(table,rows){
	table.clear();
	table.rows.add(rows).draw();
}