// Proxylist data array for filling in info box
var proxyListData = [];

var user;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    populateChangeResponseTable();
    // proxuy URL link click
    $('#proxyList table tbody').on('click', 'td a.linkshowproxy', showProxyInfo);


    // Add proxy button click
    $('#btnAddProxy').on('click', addProxy);

    // update proxy button click
    $('#btnUpdateProxy').on('click', updateProxy);

    // Delete proxy link click
    $('#proxyList table tbody').on('click', 'td a.linkdeleteproxy', deleteProxy);

    //start proxy server button click
    $('#btnStartProxy').on('click', startProxyServer);

    //stop proxy server 
    $('#btnStopProxy').on('click', stopProxyServer);

    $('#btnGo').on('click', saveUser);

    $('#btnAddChangeResponseProxy').on('click', addChangeResponseProxy)

});


function saveUser(event)
{
    event.preventDefault();
    user = $('#txtUser').val();;
    populateTable();
}

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/api/simpleproxy/', function( data ) {

        // Stick our proxy data array into a proxylist variable in the global object
       //proxyListData = data.Simpleproxy;
       proxyListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(proxyListData, function(){

            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowproxy" rel="' + this.configid + '" title="Show Details">' + this.configid + '</a></td>';
           // tableContent += '<td>' + this.port + '</td>';
            tableContent += '<td>' + this.targeturl + '</td>';
            tableContent += '<td>' + this.latency + '</td>';
            tableContent += '<td>' + this.proxyurl + '</td>';
            tableContent += '<td>' + this.https + '</td>';

            if(Boolean(this.status))
            {
                tableContent += '<td>' + "Running" + '</td>';
            }
            else
            {
                tableContent += '<td>' + "Stopped" + '</td>';
            }
         
            tableContent += '<td><a href="#" class="linkdeleteproxy" rel="' + this.configid + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#proxyList table tbody').html(tableContent);
    });
};


function populateChangeResponseTable() {

    // Empty content string
    var tableContent = '';

    alert("populating stuff");


    // jQuery AJAX call for JSON
    $.getJSON( '/api/simpleproxy/', function( data ) {

        // Stick our proxy data array into a proxylist variable in the global object
       //proxyListData = data.Simpleproxy;
       proxyListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(proxyListData, function(){

            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowproxy" rel="' + this.configid + '" title="Show Details">' + this.configid + '</a></td>';
           // tableContent += '<td>' + this.port + '</td>';
            tableContent += '<td>' + this.targeturl + '</td>';
            tableContent += '<td>' + this.proxyurl + '</td>';
            tableContent += '<td>' + this.originalresponse + '</td>';
            tableContent += '<td>' + this.modifiedresponse + '</td>';


            if(Boolean(this.status))
            {
                tableContent += '<td>' + "Running" + '</td>';
            }
            else
            {
                tableContent += '<td>' + "Stopped" + '</td>';
            }
         
            tableContent += '<td><a href="#" class="linkdeleteproxy" rel="' + this.configid + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#changeproxyList table tbody').html(tableContent);
    });
};



// Show User Info
function showProxyInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve proxy URL from link rel attribute
    var thisProxyHost = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = proxyListData.map(function(arrayItem) { return arrayItem.configid; }).indexOf(thisProxyHost);

    // Get our User Object
    var thisProxyObject = proxyListData[arrayPosition];

    //Populate Info Box
    $('#proxyID').text(thisProxyObject.configid);
    $('#updateProxy fieldset label#updateProxyURL').text(thisProxyObject.proxyurl);
    $('#updateProxy fieldset input#updateProxyTargetURL').val(thisProxyObject.targeturl);
    $('#updateProxy fieldset input#updateProxyLatency').val(thisProxyObject.latency);
    
};

function addChangeResponseProxy()
{
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addChangeProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0)
    {
        var newProxy ={ 'targeturl' : $('#addChangeProxy fieldset input#inputChProxyTargetURL').val(),
                        'stringtomatch' : $('#addChangeProxy fieldset input#inputStringtoreplace').val(),
                        'stringtoreplace' : $('#addChangeProxy fieldset input#inputReplacement').val()
                    }

          $.ajax({
                type : 'POST',
                data : newProxy,
                url  : '/api/simpleproxy/changeresponse',
                dataType : JSON
       }).done(function(response){

            alert(response.msg);

             // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addChangeProxy input').val('');

                // Update the table
              // populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        })

    }//if
    else
    {
        alert("Fill in all the fields");
        return false;
    }
        
}



function addProxy(event) {
    event.preventDefault();

//    user =  $('#txtUser').val();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all proxy info into one object
        var newProxy = {
          
            'targeturl': $('#addProxy fieldset input#inputProxyTargetURL').val(),
            'latency': $('#addProxy fieldset input#inputLatency').val()

        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newProxy,
            url: '/api/simpleproxy',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addProxy fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all the fields');
        return false;
    }
};


function updateProxyURLinConfig(newProxy, port)
{

    var id = $('#proxyID').text()

    var data = {

            'configid' : id, 
            'targeturl' : newProxy.targeturl,
            'latency' : newProxy.latency,
            'proxyurl': port
    }

     $.ajax({
            type: 'PUT',
            data: data,
            url: '/api/simpleproxy/'+id, 
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#updateProxy fieldset input').val('');
                $('#proxyID').text('');
                $('#updateProxyURL').text('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });

}

//update proxy configurations
function updateProxy(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

         var purl = $('#updateProxy fieldset label#updateProxyURL').text();
        alert("Updating to "+ purl);

        // If it is, compile all proxy info into one object
        var id = $('#proxyID').text()
        var newProxy = {

            'configid': id,
           // 'proxyurl': $('#updateProxy fieldset input#updateProxyURL').val(),
            'proxyurl': $('#updateProxy fieldset label#updateProxyURL').text(),
            'targeturl': $('#updateProxy fieldset input#updateProxyTargetURL').val(),
            'latency': $('#updateProxy fieldset input#updateProxyLatency').val()
        }

       
        $.ajax({
            type: 'PUT',
            data: newProxy,
            url: '/api/users/simpleproxy/'+id, // + $('#proxyID').text(),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#updateProxy fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Proxy
function deleteProxy(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Proxy?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        //now delete the proxy configuration
        var newProxy = {
            'id': $(this).attr('rel')
        }
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            data: newProxy,
            url: '/api/simpleproxy/'+$(this).attr('rel'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }

};


function stopProxyServer(){


    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount == 0)
    {
        $.ajax({
                 type : 'DELETE',
                 data: '',
                 url : 'http://localhost:8006/proxyserver/reverseproxy/1',
                 dataType : 'JSON'

        }).done(function(response){

    
            //update configuration data
            var data = {
             'targeturl': $('#updateProxy fieldset input#updateProxyTargetURL').val(),
             'latency'  : $('#updateProxy fieldset input#updateProxyLatency').val(),
            }

            updateProxyURLinConfig(data, '');

            alert(response.msg);
        });    
    }
    else{
        alert("Please fill in all the fields");
    }
};



function startProxyServer(){

    var errorCount = 0;
    $('#updateProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount == 0)
    {

         var data = {
            /* 'targeturl' : $('#updateProxy fieldset input#updateProxyTargetURL').val(),
             'latency' : $('#updateProxy fieldset input#updateProxyLatency').val()*/
             'configid' : $('#updateProxy fieldset span#proxyID').text()
         }

         alert(data.configid);

        //alert("in startProxyServer :" + "targeturl " + data.targeturl + "latency " + data.latency);

        $.ajax({
             type : 'POST',
             data : data,
             url : 'http://localhost:8006/proxyserver/reverseproxy',
             dataType : 'JSON'

        }).done(function(response){

            alert(response.msg);

            updateProxyURLinConfig(data, response.port);

        });
    }

    else
    {
        alert("Please select a proxy configuration from the list");
    }
};
