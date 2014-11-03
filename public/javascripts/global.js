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
    $.getJSON( '/proxys/proxylist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        proxyListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowproxy" rel="' + this.proxyHost + '" title="Show Details">' + this.proxyHost + '</a></td>';
            tableContent += '<td>' + this.port + '</td>';
            tableContent += '<td>' + this.targetHost + '</td>';
            tableContent += '<td>' + this.targetPort + '</td>';
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
    var arrayPosition = proxyListData.map(function(arrayItem) { return arrayItem.proxyHost; }).indexOf(thisProxyHost);

    // Get our User Object
    var thisProxyObject = proxyListData[arrayPosition];

    //Populate Info Box
    $('#proxyInfoProxyHost').text(thisProxyObject.proxyHost);
    $('#proxyInfoPort').text(thisProxyObject.port);
    $('#proxyInfoTargetHost').text(thisProxyObject.targetHost);
    $('#proxyInfoTargetPort').text(thisProxyObject.targetPort);

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
            'proxyHost': $('#addProxy fieldset input#inputProxyHost').val(),
            'port': $('#addProxy fieldset input#inputProxyPort').val(),
            'targetHost': $('#addProxy fieldset input#inputProxyTargetHost').val(),
            'targetPort': $('#addProxy fieldset input#inputProxyTargetPort').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newProxy,
            url: '/proxys/addProxy',
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

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/proxys/deleteProxy/' + $(this).attr('rel')
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