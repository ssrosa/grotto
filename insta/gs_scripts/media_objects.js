var user_access_token = "";
var page_id = "";
var insta_id = "";
var media_objects_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("media_objects");


function getMediaObjectData() {
  //LATER: define the range of objects to return. One day's worth?
  var media_object_ids = "https://graph.facebook.com/v4.0/" + insta_id + "/media?" + user_access_token + "&limit=10";
  var response = UrlFetchApp.fetch(media_object_ids);
  Logger.log(response.getContentText());
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);

  var id_arr_raw = [];
  //For each media object:
  data['data'].forEach(function(object) {
    //Get id of each object
    id_arr_raw.push(object['id']);
  });
  Logger.log(id_arr_raw);
  //Reverse ids so they'll be chronological
  var id_arr = id_arr_raw.reverse();
  Logger.log(id_arr);
  
  // How to compare ids from this call to those already in the spreadsheet?
  //
  
  //New loop runs on array of chron. ids
  //For each id in arr  
  id_arr.forEach(function(obj_id) {
    //Call API again to get the rest of the values 
    var media_object = "https://graph.facebook.com/v4.0/" + 
      obj_id + "?fields=caption,comments,comments_count,media_type,media_url,like_count,timestamp&" + user_access_token;
    //Call API
    var response = UrlFetchApp.fetch(media_object);
    Logger.log(response.getContentText());
    // Parse the JSON reply
    var json = response.getContentText();
    var data = JSON.parse(json);
    //Capture each piece of data from the json file
    var values = [obj_id, data['timestamp'], data['caption'], 
                 data['comments'], data['comments_count'], 
                 data['media_type'], data['media_url'], 
                 data['like_count']];
    Logger.log(values);
    
    //Get insight metrics -- these vary by media object.
    if (data['media_type'] == 'IMAGE' ) {
      var metrics = "engagement,impressions,reach,saved,"
    }   
    else if (data['media_type'] == 'VIDEO') {
      //video_views throws an error if used on an image
      var metrics = "engagement,impressions,reach,saved,video_views"
    }
    else if (data['media_type'] == 'CAROUSEL_ALBUM') {
      //video_views will apparently just return 0 on this one if it's not a vid
      var metrics = "carousel_album_engagement,carousel_album_impressions,carousel_album_reach,carousel_album_saved,carousel_album_video_views";
    }
    //Array to hold insight metrics (4 or 5 values)
    var insights = [];
    var insights_request = "https://graph.facebook.com/v4.0/" + obj_id + "/insights?metric=" + metrics + "&" + user_access_token;
    //Call API
    var results = JSON.parse(UrlFetchApp.fetch(insights_request).getContentText());
    //Append the insight value sto the array. (4 or 5 more values)
    results['data'].forEach(function(metric) {
      values.push(metric['values'][0]['value'])
    });
    //2d array of values
    var values_arr = [values];
    //Write values to sheet
    media_objects_sheet.getRange(media_objects_sheet.getLastRow()+1, 1, values_arr.length, values_arr[0].length).setValues(values_arr);
  });  
}
