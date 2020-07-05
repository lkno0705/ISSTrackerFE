// Backendcall for RSS-Feed

var startRss = 0;
var endRss = 5;

function rssClick(e){
    if (e === -1 && startRss !== 0){
        endRss = startRss;
        startRss = startRss - 5;
    }
    else if (e === 1){
        startRss = endRss
        endRss = endRss + 5
    }
    document.getElementById("mySidebar").innerHTML="";
    rssCallBackEnd(startRss, endRss);
}

function rssCall(){
    rssCallBackEnd(0, 5);
}

function rssCallBackEnd(start, end){
    var oData = {};
    oData.call = "RSS-Feed";
    oData.data =      "<requestName>RSS-Feed</requestName>" +
                            "<params>" +
                                "<startID>" + start + "</startID>" +
                                "<endID>" + end + "</endID>" +
                            "</params>";
    oData.callback = RSSCallback;
    oData.type = "POST";
    ajaxCall(oData);
}

<<<<<<< HEAD
function RSSCallback(oData){ 
    var xmlDoc = oData
    if (xmlDoc.childNodes[1].childNodes[1].childNodes.length > 0)
=======
function RSSCallback(oData){    
    if (oData.childNodes[1].childNodes[1].childNodes.length > 0)
>>>>>>> d8ef0d436a294f4cdceb0f1627e2a96ac110c3c5
    {
        transform2(oData, 'xsl/rssfeednasa.xsl',"mySidebar"); // XSL transformation
        // console.log("RSS-Feed");       
    }
    else
     rssClick(-1);
}
