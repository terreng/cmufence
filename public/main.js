function gid(id) {
    return document.getElementById(id);
}

function checkState() {
    gid("nav_home").classList.remove("active");
    gid("nav_history").classList.remove("active");
    gid("nav_rules").classList.remove("active");
    gid("nav_leaderboard").classList.remove("active");

    if (document.location.pathname == "/") {
        openHome();
        gid("nav_home").classList.add("active");
    } else if (document.location.pathname == "/history") {
        openHistory();
        gid("nav_history").classList.add("active");
    } else if (document.location.pathname == "/rules") {
        openRules();
        gid("nav_rules").classList.add("active");
    } else if (document.location.pathname == "/leaderboard") {
        openLeaderboard();
        gid("nav_leaderboard").classList.add("active");
    }
}

function openHome() {

}

function openHistory() {

}

function openRules() {

}

function openLeaderboard() {

}

window.onpopstate = function () {
    checkState();
}

function navigate(newlocation) {
    history.pushState(undefined, undefined, newlocation);
	checkState();
}