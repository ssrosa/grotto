var user_access_token = "";
var page_id = "";
var insta_id = "";
var media_objects_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("media_objects");
var pull_range = 15; // NUmber of media objects to be pulled

/*
This function gets the 15 most recent media objects. If any of the IDs in these 15 match IDs that
are already in the table, those rows get deleted and replaced by these. There is no option to define
the range of IDs returned in the query by date; if there were, we could simply pull a week's worth.
This method of replacing duplicates is the workaround for that.
*/

function getMediaObjectData() {

  var media_object_ids = "https://graph.facebook.com/v4.0/" + insta_id + "/media?" + user_access_token + "&limit=" + pull_range;
  var response = UrlFetchApp.fetch(media_object_ids);
  
  // Parse the JSON reply
  var data = JSON.parse(response.getContentText());

  var id_arr_raw = [];
  //For each media object:
  data['data'].forEach(function(object) {
    //Get id of each object
    id_arr_raw.push(object['id']);
  });
  //Logger.log(id_arr_raw);
  //Reverse ids so they'll be chronological
  var id_arr = id_arr_raw.reverse();
  Logger.log(id_arr);

  //Delete rows that will be duplicated:
  // Compare the id of the last row to the id_arr and delete the row
  // if the id is found. Continue until id is not found.
  var id_found = true; 
  while (id_found == true) {
    var id_to_compare = (media_objects_sheet.getRange(media_objects_sheet.getLastRow(), 1).getValue());
    if (id_arr.indexOf(id_to_compare) != -1) {
      media_objects_sheet.deleteRow(media_objects_sheet.getLastRow());
    } else {
      id_found = false;
    }
  }
  
  id_arr.forEach(function(obj_id) {
    //Call API again to get the rest of the values 
    var media_object = "https://graph.facebook.com/v4.0/" + 
      obj_id + "?fields=caption,comments,comments_count,media_type,media_url,like_count,timestamp&" + user_access_token;
    //Call API
    var response = UrlFetchApp.fetch(media_object);
    // Parse the JSON reply
    var data = JSON.parse(response.getContentText());
    //Capture each piece of data from the json file
    //data['comments'] can't be read unless it is stringified first.
     var values = [obj_id, data['timestamp'], data['caption'], 
                 JSON.stringify(data['comments']), data['comments_count'], 
                 data['media_type'], data['media_url'], 
                 data['like_count']];

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
