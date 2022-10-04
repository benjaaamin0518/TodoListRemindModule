function csvToarray(link, name) {
  //
  try {
    var response = UrlFetchApp.fetch(link);
    var data = response.getContentText("UTF-8");
    var csv = Utilities.parseCsv(data);

    var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    while (sfiles.hasNext()) {
      var s = sfiles.next();

      if (s.getName() == name) {
        var id = s.getId();
        var message = name + "は存在するファイルでした。"
        break;
      }
    }
    if (!id) {
      var newf = SpreadsheetApp.create(name);
      var message = name + "は存在しないものだったので新規に作成しました。"
      var id = newf.getId();
    }
    csvWriteTosheet(csv, id);
    return message;
  }
  catch (e) {
    var csv = "";
    var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    while (sfiles.hasNext()) {
      var s = sfiles.next();
      if (s.getName() == name) {
        var id = s.getId();
        var message = name + "は存在するファイルでした。"
        break;
      }
    }
    if (!id) {
      var newf = SpreadsheetApp.create(name);
      var message = name + "は存在しないものだったので新規に作成しました。"
      var id = newf.getId();
    }
    csvWriteTosheet(csv, id);
    return message;
  }
}
function csvWriteTosheet(csv, id) {
  if (id) {
    var ss = SpreadsheetApp.openById(id);
    var sheet = ss.getSheetByName("シート1");
    sheet.clear();
    if (csv[0]) {
      sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
    }
  }
  else {
    Logger.log('IDが取得できませんでした。');
  }

}
function idToMessage(id) {
  if (id) { }
  else {
    Logger.log('IDが取得できませんでした。');
  }
}
function idToCsvData(names) {
  var ids = [];
  var i = 0;
  names.forEach(function (name) {
    var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
    while (sfiles.hasNext()) {
      var s = sfiles.next();

      if (s.getName() == name) {
        var id = s.getId();
        var message = id + "data";
        ids[i] = id;
        i++;
        break;
      }
    }


  });
  return ids;
}
function mailToData(ids) {
  var cell = 0;
  var mailData = [];
  ids.forEach(function (id) {
    x = 0;
    mailData[cell] = [];
    var ss = SpreadsheetApp.openById(id);
    var sheet = ss.getSheetByName("シート1");
    let maxRow = sheet.getMaxRows();
    var lastRow = sheet.getRange(maxRow, 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
    var i = 1;
    if (lastRow) {
      while (i <= lastRow) {
        var task = sheet.getRange(i, 2).getValue();
        var year = sheet.getRange(i, 3).getValue();
        var month = sheet.getRange(i, 4).getValue();
        var date = new Date;
        if (date.getFullYear() == year && date.getMonth() + 1 == month) {

          mailData[cell][x] = task;

          x++;
        }
        else if (year == "" && month == date.getMonth() + 1) {
          mailData[cell][x] = task;

          x++;
        }
        else if (month == "" && date.getMonth() + 1 == 12 && year == date.getFullYear()) {
          mailData[cell][x] = task;

          x++;

        }

        i++;
      }

    }
    else {
      return null;
    }
    cell++;
  });
  cell--;
  x--;
  return mailData;
}
function CsvtoAdress(ids, names) {
  var name = "pass";
  var adress_box = [];
  var sfiles = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
  while (sfiles.hasNext()) {
    var s = sfiles.next();

    if (s.getName() == name) {
      var id = s.getId();
      break;
    }
  }
  x = 0;
  names.forEach(function (name) {

    var ss = SpreadsheetApp.openById(id);
    var sheet = ss.getSheetByName("シート1");
    let maxRow = sheet.getMaxRows();
    var lastRow = sheet.getRange(maxRow, 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();

    var i = 1;
    var flag = 0;
    if (lastRow) {
      while (i <= lastRow) {

        var user = sheet.getRange(i, 3).getValue();
        user = String(user).replace(".csv", "");

        var adress = sheet.getRange(i, 6).getValue();
        if (user == name) {
          adress_box[x] = adress;
          flag = 1;
          x++;
        }
        i++;
      }
      if (flag == 0) {

        Logger.log(adress_box[x]);
        x++;
      }
    }
    else {
      return null;
    }

  });
  x--;
  return adress_box;
}
function mailToSend(adress, datas) {
  let date = new Date;
  let month = date.getMonth() + 1;
  let i = 0;
  const foot = "詳しい内容は以下のページにてご確認ください。\n\nhttp://~~~~~~~~~~~~push.php";
  let box = [];
  datas.forEach(function (data) {
    let str = "";
    let msg = "";
    let to = "";
    if (i == 0) {
      msg = "共有の" + month + "月中に消化予定のタスク---------------------------\n";
    }
    else {
      msg = "あなたの" + month + "月中に消化予定のタスク---------------------------\n";
    }
    data.forEach(function (task) {
      task = "・" + task + "\n";
      Logger.log(task);
      str = str + task;
    });
    if (i == 0) {
      if (str) {
        box[i] = msg + str;
      }
    }
    else {
      if (str) {
        box[i] = (box[0]) ? msg + str + "\n" + box[0] + "\n" + foot : msg + str + "\n" + foot;
        to = month + "月中に消化予定のタスクのリマインド通知";
        MailApp.sendEmail(adress[i], to, box[i]);
        Logger.log(to + box[i]);
      }
      else {
        box[i] = (box[0]) ? box[0] + "\n" + foot : "";
        if (box[i]) {
          to = month + "月中に消化予定のタスクのリマインド通知";
          MailApp.sendEmail(adress[i], to, box[i]);
          Logger.log(to + box[i]);
        }
      }
    }
    i++;
  });
  return 0;
}
