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
    var values = [];
    //Capture each piece of data from the json file
    values.push([obj_id, data['timestamp'], data['caption'], data['comments'], data['comments_count'], data['media_type'], data['media_url'], data['like_count']]);
    Logger.log(values);
    //Write values to sheet
   // story_insights_sheet.getRange(story_insights_sheet.getLastRow()+1, 1, values_arr.length, values_arr[0].length).setValues(values_arr);

    media_objects_sheet.getRange(media_objects_sheet.getLastRow()+1, 1, values.length, values[0].length).setValues(values);
  });

}

