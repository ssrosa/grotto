var user_access_token = "";
var page_id = "";
var insta_id = "";
var dailies_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("dailies");

// Without setting "since" and "until" this request will pull data from the previous two days.
// Use only the latter (or former?) day's data for each pull to avoid duplication.
function getDailyUserInsights() {
  var metrics = 'email_contacts,follower_count,get_directions_clicks,impressions,phone_call_clicks,profile_views,reach,text_message_clicks,website_clicks';
  var request = "https://graph.facebook.com/v4.0/" + insta_id + 
    "/insights?metric=" + metrics +
    "&period=day"
     + "&" + user_access_token;
  //Call API
  var response = UrlFetchApp.fetch(request);
  var json = response.getContentText();
  var data = JSON.parse(json);
  // Get the timestamp
  var end_time = data['data'][0]['values'][1]['end_time'];
  //Set up an array to hold the values
  var values = [end_time];
  //For each item in the data list
  data['data'].forEach(function(metric) {
    var value = metric['values'][1]['value'];
    values.push(value)
  });
  //Logger.log(values);
  //Turn values into 2D array
  var values_arr = [values];
  //Write values to sheet
  dailies_sheet.getRange(dailies_sheet.getLastRow()+1, 1, values_arr.length, values_arr[0].length).setValues(values_arr);

}