var ajaxCall = function(oData){
    var date = new Date;    
    if(!oData.e)
        oData.e= "";
    if (oData.type == "POST")
    {
     oData.data =   '<?xml version=\'1.0\' encoding=\'UTF-8\'?>' + 
                    '<!DOCTYPE Request SYSTEM \'./DTD/' + oData.call + '.dtd\'>' + 
                    "<Request>" +
                       oData.data +
                    "</Request>";
        $.ajax({
            crossDomain: true,
            contentType: "application/xml; charset=utf-8",    
            type: oData.type,
            url: 'https://iss-trackr-api.azurewebsites.net/' + oData.call,        
            xml: "application/xml",
            dataType: 'xml',
            cache: false,
            headers: {  'Access-Control-Allow-Origin': 'https://iss-trackr-api.azurewebsites.net/' + oData.call},   
            data: oData.data,
            success: function(oReturnData) { console.log(date.toLocaleTimeString() + " | " +  oData.call + " Success!")
                                            oData.callback(oReturnData, oData.e); },
            error: function(oReturnData) {  console.log(oData.call + ' Failed!');
                                            console.log(oReturnData) }      
        });
    }
    else
    {
        $.ajax({
            url: 'https://iss-trackr-api.azurewebsites.net/' + oData.call,        
            data: oData.data,
            type: oData.type,            
            crossDomain: true,
            dataType: 'xml',
            success: function(oReturnData) { console.log(date.toLocaleTimeString() + " | " + oData.call + " Success!")
                                             oData.callback(oReturnData, oData.e); },
            error: function(oReturnData)   {console.log(oData.call + ' Failed!');
                                            console.log(oReturnData) }   
        });
    }

}

