
// Requires two API calls, one for regular metrics
// and one for the special lifetime insights.
function getLifetimeUserInsights() {
  //User metrics available from User endpoint
  var user_metrics = "followers_count,follows_count,media_count"
  var um_request = "https://graph.facebook.com/v4.0/" + insta_id + 
    "?fields=" + user_metrics + "&" + user_access_token;
  //Call API
  var um_response = UrlFetchApp.fetch(um_request);
  var um_json = um_response.getContentText();
  var um_data = JSON.parse(um_json);
  //Get current datetime
  var now = new Date();
  var values = [now, um_data['followers_count'], um_data['follows_count'], um_data['media_count']];
  Logger.log(values);
  
  // Lifetime metrics available from Insights
  var lifetime_metrics = 'audience_city,audience_country,audience_gender_age,audience_locale,online_followers,';
  var lm_request = "https://graph.facebook.com/v4.0/" + insta_id + 
    "/insights?metric=" + lifetime_metrics +
    "&period=lifetime"
     + "&" + user_access_token;
  //Call API
  var lm_response = UrlFetchApp.fetch(lm_request);
  var lm_json = lm_response.getContentText();
  var lm_data = JSON.parse(lm_json);
  Logger.log(lm_data);
  //Write each of the values from the json into the values array
  lm_data['data'].forEach(function (metric) {
    values.push(metric['values'][0]['value']);
  });
  Logger.log(values);
  //Turn values into 2D array
  var values_arr = [values];
  //Write values to sheet
  lifetimes_sheet.getRange(lifetimes_sheet.getLastRow()+1, 1, values_arr.length, values_arr[0].length).setValues(values_arr);
}