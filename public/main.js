function gid(id) {
    return document.getElementById(id);
}

function checkState() {
    gid("nav_home").classList.remove("active");
    gid("nav_history").classList.remove("active");
    gid("nav_rules").classList.remove("active");
    gid("nav_leaderboard").classList.remove("active");

    gid("container_home").style.display = "none";
    gid("container_history").style.display = "none";
    gid("container_rules").style.display = "none";
    gid("container_leaderboard").style.display = "none";
    gid("container_scan").style.display = "none";

    if (document.location.pathname == "/") {
        openHome(getDateID(new Date().getMonth(), new Date().getDate(), new Date().getFullYear(), true));
        gid("nav_home").classList.add("active");
    } else if (document.location.pathname == "/history") {
        openHistory();
        gid("nav_history").classList.add("active");
        gid("container_history").style.display = "block";
    } else if (document.location.pathname.startsWith("/history/")) {
        openHistoryDay();
        gid("nav_history").classList.add("active");
    } else if (document.location.pathname == "/rules") {
        openRules();
        gid("nav_rules").classList.add("active");
        gid("container_rules").style.display = "block";
    } else if (document.location.pathname == "/leaderboard") {
        openLeaderboard();
        gid("nav_leaderboard").classList.add("active");
        gid("container_leaderboard").style.display = "block";
    } else if (document.location.pathname == "/scan") {
        openScan();
        gid("container_scan").style.display = "block";
    }
}

function openHistoryDay() {
    var date = document.location.pathname.split("/")[2];
    var datearray = date.split("-");
    var month = datearray[0];
    var day = datearray[1];
    var year = datearray[2];
    var realdate = new Date(year, month - 1, day);
    if (realdate == "Invalid Date") {
        window.location = "/history";
    } else {
        gid("container_home").style.display = "block";
        openHome(getDateID(month - 1, day, year, true));
    }
}

var shortmontharray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function openHome(dateid) {

    gid("container_home").style.display = "none";

    firebase.firestore().collection("fences").orderBy("dateid", "desc").startAt(dateid).limit(1).get().then(function (querySnapshot) {
        
        var fenceinfo = false;

        querySnapshot.forEach(function (doc) {
            fenceinfo = doc.data();
        });

        if (fenceinfo) {

            gid("container_home").style.display = "block";

            if (fenceinfo.image) {
                gid("fence_image").style.display = "block";
                gid("fence_image").src = "https://firebasestorage.googleapis.com/v0/b/cmu-fence.appspot.com/o/"+fenceinfo.image.split("/").join("%2F")+'?alt=media';

                gid("model_container").style.display = "none";
            } else {
                gid("fence_image").style.display = "none";
                gid("model_container").style.display = "";

                gid("model_container").innerHTML = '<model-viewer src="https://firebasestorage.googleapis.com/v0/b/cmu-fence.appspot.com/o/'+fenceinfo.model.split("/").join("%2F")+'?alt=media" shadow-intensity="1" camera-controls touch-action="pan-y" max-field-of-view="'+(window.innerWidth <= 900 ? 12 : 9)+'deg" min-field-of-view="5deg"></model-viewer>';

                if (window.innerWidth <= 900) {
                    gid("model_container").classList.add("mobile");
                }
            }

            let date = parseDateID(fenceinfo.dateid);
            gid("fence_date").innerText = shortmontharray[date[0]] + " " + date[1] + ", 20" + date[2];

            gid("fence_message").innerHTML = htmlescape(fenceinfo.message || "No message").replace(/((http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9.]{2,256}\.[a-z]{2,6}\b(([-a-zA-Z0-9@:%_\+.~#?&//=]|(&amp;))*?(?=(?:((\.)|,)(\s|$))|(\s|$))))/gi, function (a) { return '<a href="' + a.replace(/&amp;/g, "&") + '" target="_blank">' + a + '</a>' });

            gid("fence_organization").innerText = fenceinfo.organization || "None";

            gid("painters_list").innerHTML = "";

            fenceinfo.painters.forEach(function (painterid) {

                firebase.firestore().collection("painters").doc(painterid).get().then(function (doc) {

                    if (doc.exists) {
                        gid("painters_list").innerHTML += '<a href="/leaderboard/'+doc.id+'" onclick="navigate(\'/leaderboard/'+doc.id+'\'); return false;"><div class="painter"><img src="'+doc.data().photoURL+'" class="painter_image"><div class="painter_name">'+htmlescape(doc.data().displayName)+'</div></div></a>';
                    } else {
                        gid("painters_list").innerHTML += '<a href="/leaderboard/'+painterid+'" onclick="navigate(\'/leaderboard/'+painterid+'\'); return false;"><div class="painter"><img src="/images/placeholderpfp.jpg" class="painter_image"><div class="painter_name">'+htmlescape(painterid)+'</div></div></a>';
                    }

                }).catch(function (error) {
                    console.error(error);
                });

            });

            // firebase.firestore().collection("painters").where("fences", "array-contains", fenceinfo.dateid).get().then(function (querySnapshot) {

            //     var found_painters = [];
				
            //     querySnapshot.forEach(function (doc) {
            //         var painter = doc.data();

            //         found_painters.push(doc.id);

            //         gid("painters_list").innerHTML += '<a href="/leaderboard/'+doc.id+'" onclick="navigate(\'/leaderboard/'+doc.id+'\'); return false;"><div class="painter"><img src="'+painter.photoURL+'" class="painter_image"><div class="painter_name">'+htmlescape(painter.displayName)+'</div></div></a>';
            //     });

            //     fenceinfo.painters.filter(function (a) { return found_painters.indexOf(a) == -1 }).forEach(function (painterid) {

            //         gid("painters_list").innerHTML += '<a href="/leaderboard/'+painterid+'" onclick="navigate(\'/leaderboard/'+painterid+'\'); return false;"><div class="painter"><img src="/images/placeholderpfp.jpg" class="painter_image"><div class="painter_name">'+htmlescape(painterid)+'</div></div></a>';

            //     });

			// }).catch(function (error) {
			// 	console.error(error);
			// });

        } else {

        }

    }).catch(function (error) {
        console.error(error);
    });

}

function openHistory() {
    var realdate = new Date(Date.now());
    calendarmonth = realdate.getMonth()-1;
    calendaryear = realdate.getFullYear();

    renderCalendarMonth();
}

function openRules() {

}

function openLeaderboard() {

}

function openScan() {
    // if (firebase.auth().currentUser) {

    // } else {
    //     navigate("/");
    // }
    if (firebase.auth().currentUser && gid("fence_painters").value == "") {
        gid("fence_painters").value = firebase.auth().currentUser.email.split("@")[0]+"\n";
    }
}

function uploadFence() {
    gid("submit_button").style.display = "none";
    gid("submit_button_loading").style.display = "";

    let filename = firebase.auth().currentUser.uid+"/"+Date.now()+".glb";

    firebase.storage().ref().child(filename).put(gid("fence_model").files[0]).then(function(snapshot) {
        firebase.firestore().collection("fences").add({
            dateid: getDateID(new Date().getMonth(), new Date().getDate(), new Date().getFullYear(), true),
            message: gid("message").value || null,
            organization: gid("organization_name").value || null,
            model: filename,
            painters: gid("fence_painters").value.split("\n").filter(function(a) { return a.length > 0 })
        }).then(function() {
            navigate("/");
            gid("fence_model").value = "";
            gid("message").value = "";
            gid("organization_name").value = "";
            gid("fence_painters").value = "";
            gid("submit_button").style.display = "";
            gid("submit_button_loading").style.display = "none";
        }).catch(function(error) {
            console.error(error);
        });
    }).catch(function(error) {
        console.error(error);
    });
}

var calendarmonth;
var calendaryear;
var montharray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function calChevNext() {

	calendarmonth += 1;
	if (calendarmonth == 12) {
		calendarmonth = 0;
		calendaryear += 1;
	}
	renderCalendarMonth()

}

function calChevPrev() {

	calendarmonth -= 1;
	if (calendarmonth == -1) {
		calendarmonth = 11;
		calendaryear -= 1;
	}
	renderCalendarMonth()

}

function renderCalendarMonth() {
	var realdate = new Date(Date.now());
	var real_month = realdate.getMonth();
	var real_year = realdate.getFullYear();
	var real_day = realdate.getDate();

	var prevmonth = calendarmonth - 1;
	var prevyear = calendaryear;
	if (prevmonth == -1) {
		prevyear -= 1;
		prevmonth = 11;
	}

	var firstday = new Date(montharray[calendarmonth] + " 1 " + calendaryear);

	var startday = daysInMonth(prevmonth + 1, prevyear) - firstday.getDay();

	var cday = startday + 1;
	var cmonth = prevmonth;
	var cyear = prevyear;

	if (cday > daysInMonth(cmonth + 1, cyear)) {
		cday = 1;
		cmonth += 1;
		if (cmonth == 12) {
			cmonth = 0;
			cyear += 1;
		}
	}

	var pendhtml = "";

	var startdate = [];
	var enddate = [];

	for (var i = 0; i < 42; i++) {

		if (i === 0) {
			startdate = [cmonth, cday, cyear];
		}
		if (i === 41) {
			enddate = [cmonth, cday, cyear];
		}

		var cbd = "";
		if (cmonth !== calendarmonth || cyear !== calendaryear) {
			cbd = "diff_month";
		}

		if (cmonth == real_month && cday == real_day && cyear == real_year) {
			cbd += " is_today";
		}

        var thisdate = new Date(montharray[cmonth] + " " + cday + " " + cyear);

		if (i > 34) {
			cbd += " bottom_week";
		}

		var cm_next = real_month + 1;
		var cm_prev = real_month - 1;
		var cmy_next = real_year + 2;
		var cmy_prev = real_year - 2;
		if (cm_next == 12) { cm_next = 0; cmy_next += 1; }
		if (cm_prev == -1) { cm_prev = 11; cmy_prev -= 1; }

		if (thisdate.getDay() == 0) {
			pendhtml += '<div class="equal_grid">'
		}

		if ((cmonth == cm_next && cyear == cmy_next) || (cmonth == cm_prev && cyear == cmy_prev)) {

			pendhtml += '<div id="calendarday_' + cday + '_' + cmonth + '_' + cyear + '" class="calendar_unit diff_month calendar_disallowed ' + cbd + '"><div class="calb_day">' + cday + '</div><div class="icon_box"></div></div>';

		} else {

			pendhtml += '<div id="calendarday_' + cday + '_' + cmonth + '_' + cyear + '" onclick="navigate(\'/history/' + (cmonth + 1) + '-' + cday + '-' + (cyear) + '\')" class="calendar_unit ' + cbd + '"><div class="calb_day">' + cday + '</div><div class="icon_box"></div></div>';

		}

		if (thisdate.getDay() == 6) {
			pendhtml += '</div>'
		}

		cday += 1;
		if (cday > daysInMonth(cmonth + 1, cyear)) {
			cday = 1;
			cmonth += 1;
			if (cmonth == 12) {
				cmonth = 0;
				cyear += 1;
			}
		}

	}

    gid("cal_month_inner").innerHTML = pendhtml;
    gid("month_name").innerText = montharray[calendarmonth] + " " + calendaryear;

    firebase.firestore().collection("fences").orderBy("dateid", "asc").startAt(getDateID(startdate[0], startdate[1], startdate[2], true)).endAt(getDateID(enddate[0], enddate[1], enddate[2], true)).get().then(function (querySnapshot) {

        querySnapshot.forEach(function (doc) {
            var fenceinfo = doc.data();
            var date = parseDateID(fenceinfo.dateid);
            gid("calendarday_"+date[1]+"_"+date[0]+"_20"+date[2]).querySelector(".icon_box").innerHTML = '<img src="https://firebasestorage.googleapis.com/v0/b/cmu-fence.appspot.com/o/'+fenceinfo.thumbnail.split("/").join("%2F")+'?alt=media">';
        });

    }).catch(function (error) {
        console.error(error);
    });
}

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

window.onpopstate = function () {
    checkState();
}

function navigate(newlocation) {
    history.pushState(undefined, undefined, newlocation);
	checkState();
}

function signOut() {//logOut
	firebase.auth().signOut().then(function () {
        if (document.location.pathname == "/scan") {
            navigate("/");
        }
	}).catch(function (error) {

	})
}

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
    
    }).catch((error) => {

        console.error(error);

        if (error.message.indexOf("auth/error-code:-47") > -1) {
            
            setTimeout(function() {
                alert("You must sign in with your Andrew email address");
            }, 500);

        }
        
    });
}

function htmlescape(str) {
	if (str == undefined) {
		return str;
	}
	str = String(str);
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function getDateID(month, day, year, extended) {
	if (year > 99) { year -= 2000 };
	if (String(day).length == 1) { day = "0" + String(day) };
	if (String(month).length == 1) { month = "0" + String(month) };
	return Number(String(year) + String(month) + String(day)) + (extended ? 20000000 : 0);;
}

function parseDateID(dateid) {
	if (!isNaN(Number(dateid))) {
		var stringid = String(Number(dateid));
		if (stringid.length == 8) {
			stringid = stringid.substring(2);
		}
		if (stringid.length == 6) {
			var year = stringid.substring(0, 2);
			var month = stringid.substring(2, 4);
			var day = stringid.substring(4, 6);
			var date = new Date(montharray[Number(month)] + " " + day + " 20" + year);
			if (date && !isNaN(date)) {
				return [Number(month), Number(day), Number(year)];
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function toggleNav() {
    if (window.innerWidth <= 992) {
        gid("toggle_nav_button").click();
    }
}