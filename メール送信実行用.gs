var names = [];
var key = 0;
var value = 0;
function myFunction() {
  var link = "http://~~~~~~~~~~~~~~~pass.csv";
  var name = "pass";
  var result = csvToarray(link, name);
  if (!result) {
    return null;
  }
  Logger.log(result);
  var link = "http://~~~~~~~~~~~~~~~world_todo.csv";
  var name = "world_todo";
  var result = csvToarray(link, name);
  if (!result) {
    return null;
  }
  Logger.log(result);
  names[key] = name;
  key++;
  myFunction2();
}
function myFunction2() {
  var name = "world_todo";
  var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
  while (sfiles.hasNext()) {
    var s = sfiles.next();

    if (s.getName() == name) {
      var id = s.getId();
      break;
    }
  }
  var world = idToMessage(id);
  var name = "pass";
  var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
  while (sfiles.hasNext()) {
    var s = sfiles.next();

    if (s.getName() == name) {
      var id = s.getId();
      break;
    }
  }
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName("シート1");
  let maxRow = sheet.getMaxRows();
  var lastRow = sheet.getRange(maxRow, 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
  var i = 1;
  if (lastRow) {
    while (i <= lastRow) {
      var link = "**ディレクトリまでのURLをここに書く**" + sheet.getRange("C" + i).getValue();
      let vc = sheet.getRange("C" + i).getValue();
      var name = vc.replace(".csv", "");
      var result = csvToarray(link, name);
      names[key] = name;
      key++;
      Logger.log(result);
      i++;
    }

    result = idToCsvData(names);
    //次の関数を設定
    adress = CsvtoAdress(result, names);
    Logger.log(adress);

    result = mailToData(result);
    Logger.log(result);
    result = mailToSend(adress, result);
    return null;
  }
  else {
    return null;
  }
}
