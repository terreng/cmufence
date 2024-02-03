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

    if (document.location.pathname == "/") {
        openHome();
        gid("nav_home").classList.add("active");
        gid("container_home").style.display = "block";
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
    }
}

function openHome() {

}

function openHistory() {
    var realdate = new Date(Date.now());
    calendarmonth = realdate.getMonth();
    calendaryear = realdate.getFullYear();

    renderCalendarMonth();
}

function openRules() {

}

function openLeaderboard() {

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