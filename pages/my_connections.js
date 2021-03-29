import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { session } from 'wix-storage';

let topOptions = {
  "duration":   1200,
  "delay":      0,
  "direction":  "bottom"
};

function translate() {
	let language = session.getItem("language");
	if (language === "somali") {
		let elements_to_hide = $w("#text42, #text43, #button27, #text71");
		elements_to_hide.hide();

		$w("#text69").show("roll", {"duration": 1200, "delay": 0, "direction": "left"})
		$w("#text70").show("roll", {"duration": 1200, "delay": 1200, "direction": "left"})
		$w("#somalitext71").show("slide", {"duration": 1200, "delay": 2000, "direction": "top"})
		$w("#somalibutton27").show("slide", {"duration": 1200, "delay": 2000, "direction": "bottom"})

	} else { // in english
		$w("#text42").show("roll", {"duration": 1200, "delay": 0, "direction": "left"})
		$w("#text43").show("roll", {"duration": 1200, "delay": 1200, "direction": "left"})
		$w("#text71").show("slide", {"duration": 1200, "delay": 2000, "direction": "top"})
		$w("#button27").show("slide", {"duration": 1200, "delay": 2000, "direction": "bottom"})

		let second_hide = $w("#text69, #text70, #somalitext71, #somalibutton27");
		second_hide.hide();
	}
}

function sortByFrequency(array) {
    var freq = {};
    var sortAble = [];
    var newArr = [];

    array.forEach(function(value) {
        if ( value in freq )
            freq[value] = freq[value] + 1;
        else
            freq[value] = 1;
    });

    for(var key in freq){
        sortAble.push([key, f[key]])
    }

    sortAble.sort(function(a, b){
        return b[1] - a[1]
    })

    sortAble.forEach(function(obj){
        for(var i=0; i < obj[1]; i++){
            newArr.push(obj[0]);
        }
    })

	newArr.push("placeholder")
	let finalArr = []
	let count = 0
	newArr.forEach(function(a) {
		if (count > 0) {
			if (a !== newArr[count - 1]) {
				finalArr.push(newArr[count - 1])
			}
		}
		count = count + 1
	})

	return finalArr;

}

function convert_to_name(tag_num) {

	if (tag_num === "1") {
		return ("talking")
	} else if (tag_num === "2") {
		return ("cleaning")
	} else if (tag_num === "3") {
		return ("food")
	} else if (tag_num === "4") {
		return ("machinery")
	} else if (tag_num === "5") {
		return ("building")
	} else if (tag_num === "6") {
		return ("organizing")
	} else if (tag_num === "7") {
		return ("computers")
	} else if (tag_num === "8") {
		return ("numbers")
	} else if (tag_num === "9") {
		return ("translating")
	}

}

function load_jobs() {

	let language = session.getItem("language")

	if (JSON.parse(session.getItem("interests")) === null) {
		console.log("no interests found")
		$w("#repeater1").collapse()
		wixWindow.openLightbox("My Interests")
	} else {
		console.log("loading interests")
		let interest_array = JSON.parse(session.getItem("interests"));

		let tag_names = []
		interest_array.forEach(i => tag_names.push(convert_to_name(i)))
		console.log(tag_names)

		let jobs_found = []
		tag_names.forEach(tag => (
			wixData.query("jobspot")
			.contains(tag, "X")
			.find()
			.then((new_results) => {
				if (new_results.items.length === 0) {
					console.log("no jobs found for tag: " + tag)

				} else {
					console.log("jobs have been found for tag: " + tag)
					console.log(new_results.items)

					jobs_found.push(new_results.items)
					if (jobs_found.length === tag_names.length) { //all tags have been queried for
						console.log("layered array:")
						console.log(jobs_found)

						let combArray = []
						jobs_found.forEach(job_array => (
							job_array.forEach(job_ => (combArray.push(job_)))
						))

						console.log("combArray:")
						console.log(combArray)

						let list_of_IDs = []
						combArray.forEach(job => (list_of_IDs.push(job["_id"])))
						console.log("list of IDs:")
						console.log(list_of_IDs)

						let sortedArray = sortByFrequency(list_of_IDs)
						console.log("sorted list of IDs:")
						console.log(sortedArray)

						let finalArray = []
						sortedArray.forEach(function(final_ID) {
							for (let orig_job of combArray) {
								if (final_ID === orig_job["_id"]) {
            						finalArray.push(orig_job)
									break;
    							}}
							})
						console.log("final array unsliced:")
						console.log(finalArray)

						if (finalArray.length > 50) {
							finalArray = finalArray.slice(0,50)
						}
						console.log("final array sliced:")
						console.log(finalArray)
						$w("#repeater1").data = finalArray;
					}
				}
			})
		))
	}
}

$w.onReady(function () {
	translate()
   	load_jobs()
});
