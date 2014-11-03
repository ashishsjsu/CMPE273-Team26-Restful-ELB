// Proxylist data array for filling in info box
var proxyListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // proxuy URL link click
    $('#proxyList table tbody').on('click', 'td a.linkshowproxy', showProxyInfo);

    // Add proxy button click
    $('#btnAddProxy').on('click', addProxy);

    // Delete proxy link click
    $('#proxyList table tbody').on('click', 'td a.linkdeleteproxy', deleteProxy);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/simpleproxy/1', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        proxyListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowproxy" rel="' + this.Simpleproxy[0].proxyurl + '" title="Show Details">' + this.Simpleproxy[0].proxyurl + '</a></td>';
           // tableContent += '<td>' + this.port + '</td>';
            tableContent += '<td>' + this.Simpleproxy[0].targeturl + '</td>';
            tableContent += '<td>' + this.Simpleproxy[0].latency + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteproxy" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#proxyList table tbody').html(tableContent);
    });
};

// Show User Info
function showProxyInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve proxy URL from link rel attribute
    var thisProxyHost = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = proxyListData.map(function(arrayItem) { return arrayItem.proxyurl; }).indexOf(thisProxyHost);

    // Get our User Object
    var thisProxyObject = proxyListData[arrayPosition];

    //Populate Info Box
    $('#proxyInfoProxyURL').text(thisProxyObject.proxyurl);
    $('#proxyInfoTargetURL').text(thisProxyObject.targeturl);
    $('#proxyInfoLatency').text(thisProxyObject.latency);
};

// Add User
function addProxy(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProxy input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all proxy info into one object
        var newProxy = {
            'proxyurl': $('#addProxy fieldset input#inputProxyURL').val(),
            'targeturl': $('#addProxy fieldset input#inputProxyTargetURL').val(),
            'latency': $('#addProxy fieldset input#inputLatency').val(),
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

// Delete Proxy
function deleteProxy(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Proxy?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

       var id =  $(this).attr('rel');
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/api/simpleproxy/' + id
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