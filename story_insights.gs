var user_access_token = "access_token=";
var page_id = "";
var insta_id = "";
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("story_insights");

function getStoryInsights() {

  var stories = "https://graph.facebook.com/v4.0/" + insta_id + "/stories?" + user_access_token + "&limit=2000";
  var response = UrlFetchApp.fetch(stories);

  var json = response.getContentText();
  var data = JSON.parse(json);
  
  //For each media object:
  // Get the ids to be reversed
  var id_arr_raw = [];
 
  data['data'].forEach(function(object) {
    //Get id of each object
    id_arr_raw.push(object['id']);
  });
  Logger.log(id_arr_raw);
  //Reverse ids so they'll be chronological
  var id_arr = id_arr_raw.reverse();
  Logger.log(id_arr);
  //For each id in arr  
    id_arr.forEach(function(obj_id) {
    // Call API to get timestamp
    var timestamp_request = "https://graph.facebook.com/v4.0/" + obj_id + "?fields=timestamp&" + user_access_token;
    var timestamp = JSON.parse(UrlFetchApp.fetch(timestamp_request))['timestamp'];
    //2d matrix to map onto the spreadsheet
    var values = [obj_id, timestamp];
    var story_metrics = "exits,impressions,reach,replies,taps_forward,taps_back";
    // Call API to get insight metrics
    var story_metric_request = "https://graph.facebook.com/v4.0/" + obj_id + "/insights?metric=" + story_metrics + "&" + user_access_token;
    var results = JSON.parse(UrlFetchApp.fetch(story_metric_request).getContentText());
    //Record insight values
    for (i = 0; i <6; i++) {
         values.push(results['data'][i]['values'][0]['value']);
         }
    //2d array
    var values_arr = [values];
     //Write values to sheet
    sheet.getRange(sheet.getLastRow()+1, 1, values_arr.length, values_arr[0].length).setValues(values_arr);
    
  });
}