// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show(message) {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  new Notification(hour + time[2] + ' ' + period, {
    icon: '48.png',
    body: message
  });
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.onlySearchplus = true;
}

// Test for notification support.
if (window.Notification) {
  $(document).ready(function(){

    // While activated, show notifications at the display frequency.
    // if (JSON.parse(localStorage.isActivated)) { show(); }

    var interval = 0; // The display interval, in minutes.
    var lastNotify = 0;
    setInterval(function() {
      interval++;

      if (
          JSON.parse(localStorage.isActivated) &&
          localStorage.frequency <= interval
      ) {
        $.get("https://www.lup2p.com/lup2p/",function(data){
          var hasMore = false;
          jQuery.parseHTML(data);
          $(data).find(".product-rows-item").each(function(i,lidata){
            var lidata = $(lidata);
            var progress = $(lidata).find(".progress-txt").html();
            var title = $(lidata).find(".product-title").html();
            //alert(progress);
            var button = $(lidata).find(".ld-btn").html();
            var onlyAne = JSON.parse(localStorage.onlySearchplus);
            if (onlyAne) {
              if (title.indexOf("稳盈-安e+") >= 0) {
                if (progress != "100%" && button == "投资") {
                  hasMore = true;
                }
              }
            }else{
              if (progress != "100%" && button == "投资") {
                hasMore = true;
              }
            }
            console.log(lidata);
          });
          // alert(hasMore);
          if (hasMore) {
            var currentTime = new Date().getTime();
            // alert(currentTime);
            // 保证提醒不要太频繁
            if (currentTime - lastNotify > 30000) {
              show("has more");
              lastNotify = currentTime;
            }
          }
        });
        interval = 0;
      }
    }, 5000);
  });

}
