import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { session } from 'wix-storage';

function updateInterests() {
	if (JSON.parse(session.getItem("interests")) !== null) {
		session.removeItem("interests")
		console.log("array deleted")
		save_interests()
	} else {
		console.log("no array to delete")
		save_interests()
	}
}

function buttonClick(event) {
	let button = $w("#" + event.target.id)
	let color = button.style.backgroundColor
	change_color(button, color)
}

function translate() {
	let language = session.getItem("language");
	if (language === "somali") {
		let elements_to_hide = $w("#text42, #button1, #button2, #button3, #button4, #button5, #button6, #button7, #button8, #button9, #updateButton");
		elements_to_hide.hide();
		let elements_to_show = $w("#text64, #sbutton1, #sbutton2, #sbutton3, #sbutton4, #sbutton5, #sbutton6, #sbutton7, #sbutton8, #sbutton9, #supdateButton");
		elements_to_show.show();
	} else { // else in english
		let second_show = $w("#text42, #button1, #button2, #button3, #button4, #button5, #button6, #button7, #button8, #button9, #updateButton");
		second_show.show();
		let second_hide = $w("#text64, #sbutton1, #sbutton2, #sbutton3, #sbutton4, #sbutton5, #sbutton6, #sbutton7, #sbutton8, #sbutton9, #supdateButton");
		second_hide.hide();
	}
}

function change_color(button, color) {
	if (color === "#45B29D") { //teal, already selected
		button.style.backgroundColor = "#7A8E99" //grey out
		button.style.borderColor = "#7A8E99"
	} else {
		button.style.backgroundColor = "#45B29D" //make teal
		button.style.borderColor = "#45B29D"
	}
	button.style.borderWidth = "18px";
	setTimeout(function () {
		button.style.borderWidth = "1px";
	}, 200);
}

function save_interests() {
	let lang = session.getItem("language");
	lang = lang[0]
	console.log(lang[0])
	if (lang === "e") {
		lang = ""
	}
	let interest_array = [];
	const num_list = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
	num_list.forEach(i => save_check(i, interest_array, lang))
	console.log(interest_array)
	session.setItem("interests", JSON.stringify(interest_array))
	console.log("array saved")
	wixLocation.to("/reload");
}

function save_check(i, interest_array, lang) {
	if ($w("#" + lang + "button" + i).style.backgroundColor === "#45B29D") { //teal
		interest_array.push(i)
	}
}

$w.onReady(function () {
	translate()
	let lang = session.getItem("language")
	if (lang === null) {
		session.setItem("language", "english");
	}

	if (JSON.parse(session.getItem("interests")) !== null) {
		let old_interest_array = JSON.parse(session.getItem("interests"))

		lang = lang[0]
		if (lang === "e") {
			lang = ""
		}
		old_interest_array.forEach(i => change_color(($w("#" + lang + "button" + i))))
	} else {
		console.log("no array to load")
	}
})

export function updateButton_click(event) {
	updateInterests()
}

export function supdateButton_click(event) {
	updateInterests()
}

export function button1_click(event) {
	buttonClick(event)
}

export function button2_click(event) {
	buttonClick(event)
}

export function button3_click(event) {
	buttonClick(event)
}

export function button4_click(event) {
	buttonClick(event)
}

export function button5_click(event) {
	buttonClick(event)
}

export function button6_click(event) {
	buttonClick(event)
}

export function button7_click(event) {
	buttonClick(event)
}

export function button8_click(event) {
	buttonClick(event)
}

export function button9_click(event) {
	buttonClick(event)
}

export function Sbutton1_click(event) {
	buttonClick(event)
}

export function Sbutton2_click(event) {
	buttonClick(event)
}

export function Sbutton3_click(event) {
	buttonClick(event)
}

export function Sbutton4_click(event) {
	buttonClick(event)
}

export function Sbutton5_click(event) {
	buttonClick(event)
}

export function Sbutton6_click(event) {
	buttonClick(event)
}

export function Sbutton7_click(event) {
	buttonClick(event)
}

export function Sbutton8_click(event) {
	buttonClick(event)
}

export function Sbutton9_click(event) {
	buttonClick(event)
}

export function xout_click(event) {
	wixWindow.lightbox.close()
}
