var loadbalancerdata = [];

$(document).ready(function(){
		
		populateTable();

		$('#btnAddConfig').on('click', appendRows);

		$('#btnRemoveConfig').on('click', removeLastRow);

		$('#btnSavelbConfig').on('click', SaveLBConfiguration);

		appendRows();
});


// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/simpleproxy/loadbalancer', function( data ) {

        // Stick our proxy data array into a proxylist variable in the global object
       //proxyListData = data.Simpleproxy;
       loadbalancerdata = data;

       alert(data);

        // For each item in our JSON, add a table row and cells to the content string
        $.each(loadbalancerdata, function(){

        	alert();

            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowproxy" rel="' + this.configid + '" title="Show Details">' + this.configid + '</a></td>';
           // tableContent += '<td>' + this.port + '</td>';
            tableContent += '<td>' + this.targeturl + '</td>';
            tableContent += '<td>' + this.proxyurl + '</td>';

            if(Boolean(this.status))
            {
                tableContent += '<td>' + "Running" + '</td>';
            }
            else
            {
                tableContent += '<td>' + "Stopped" + '</td>';
            }
         
            tableContent += '<td><a href="#" class="linkdeleteproxy" rel="' + this.configid + '">Remove from loadbalancer</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#loadbalancelist table tbody').html(tableContent);
    });
};


function SaveLBConfiguration()
{
	event.preventDefault();


	var trows = $('#lbconfigtable tbody tr');
    var tcolumns;
    var Config = [];

    for(var i=0; i<trows.length; i++)
    {
    	var flag = false;
    	var instanceurl = $('#lbconfigtable tbody tr td input#instanceurl-'+i).val();
    	var instanceport = $('#lbconfigtable tbody tr td input#instanceport-'+i).val();
    	
    	if( $.trim(instanceurl).length > 0 && $.trim(instanceport).length > 0 )
    	{
    		Config[i] = instanceurl + ":" + instanceport;
    		flag = true;

    	}
    	else
    	{
    		alert('Please fill in the at-least one row or remove empty rows');
    	}
    }

    	if(Boolean(flag)){

    		alert("AJAX");
 		  //ajax call to save data in db
		  $.ajax({
    				type : 'POST',
    				data : { 'config' : Config },
    				dataType : JSON,
    				url : '/api/simpleproxy/loadbalancer'

    			}).done(function(response){ });

		    $("#lbconfigtable tbody tr").remove();
	   
 			appendRows();
 		}


    console.log({'config' : Config});

}

function removeLastRow()
{
	event.preventDefault();

			$("#lbconfigtable tbody tr:last-child").remove();
}

function appendRows()
{	
	event.preventDefault();

			var firstid = $('#lbconfigtable tr:first-child td:first-child input').attr('id');
			if(firstid === undefined || $('#lbconfigtable tbody tr').length === 0)
			{
				$firstrow = "<tr>\
                            	<td><input type='text' id='instanceurl-0'></input></td>\
                            	<td><input type='text' id='instanceport-0'></input></td>\
                            	</tr>";

                $("#lbconfigtable tbody").append($firstrow);
			}
			else
			{

				if($('#lbconfigtable tbody tr').length <= 4)
				{
					//append more rows
					var lastid = $('#lbconfigtable tr:last-child td:first-child input').attr('id');
				
					$newid = parseInt(lastid.substring(12, 13)) + 1;

					$newrow = "<tr>\
                            	<td><input type='text' id='instanceurl-"+$newid+"'></input></td>\
                            	<td><input type='text' id='instanceport-"+$newid+"'></input></td>\
                            	</tr>";

                	$("#lbconfigtable tbody").append($newrow);
            	}
            	else
            	{
            		alert("Maximum 5 instances can be added to balancer");
            	}
			}
	
}