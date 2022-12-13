document.SetTheme = function(){
    if(document.CurrentTheme=="light"){
        document.querySelector("html").classList.remove("darkForce")
        document.querySelector("html").classList.add("lightForce")
    }
    else{
        document.querySelector("html").classList.remove("lightForce")
        document.querySelector("html").classList.add("darkForce")
    }
}
document.SwitchThemes = function() {
    if(document.CurrentTheme=="light"){
        document.CurrentTheme="dark";
        document.SetTheme();
    }
    else{
        document.CurrentTheme="light";
        document.SetTheme();
    }

}
// Load up user prefered theme according to browser.
document.UserPreferedTheme = window.matchMedia(" (prefers-color-scheme:dark)").matches ? "dark":"light";
// Set the current theme to the user prefered theme
document.CurrentTheme = document.UserPreferedTheme;
// Call a function to set the theme.
document.SetTheme();
