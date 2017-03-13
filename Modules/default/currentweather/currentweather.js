/* global Module */

/* Magic Mirror
 * Module: CurrentWeather
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("currentweather",{

	// Default module config.
	defaults: {
		location: false,
		locationID: false,
		appid: "",
		units: config.units,
		updateInterval: 10 * 60 * 1000, // every 10 minutes
		animationSpeed: 1000,
		timeFormat: config.timeFormat,
		showPeriod: true,
		showPeriodUpper: false,
		showWindDirection: true,
		useBeaufort: true,
		lang: config.language,
		showHumidity: false,

		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,

		apiVersion: "2.5",
		apiBase: "http://api.openweathermap.org/data/",
		weatherEndpoint: "weather",

		appendLocationNameToHeader: true,
		calendarClass: "calendar",

		onlyTemp: false,
		roundTemp: false,

		iconTable: {
			"01d": "wi-day-sunny",
			"02d": "wi-day-cloudy",
			"03d": "wi-cloudy",
			"04d": "wi-cloudy-windy",
			"09d": "wi-showers",
			"10d": "wi-rain",
			"11d": "wi-thunderstorm",
			"13d": "wi-snow",
			"50d": "wi-fog",
			"01n": "wi-night-clear",
			"02n": "wi-night-cloudy",
			"03n": "wi-night-cloudy",
			"04n": "wi-night-cloudy",
			"09n": "wi-night-showers",
			"10n": "wi-night-rain",
			"11n": "wi-night-thunderstorm",
			"13n": "wi-night-snow",
			"50n": "wi-night-alt-cloudy-windy"
		},

		iconHTMLTable: {
			"01d": '<svg class="sunshine" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-full" d="M256,144c-61.8,0-112,50.2-112,112s50.2,112,112,112s112-50.2,112-112S317.8,144,256,144z M256,336 c-44.2,0-80-35.8-80-80s35.8-80,80-80s80,35.8,80,80S300.2,336,256,336z"/> <path class="sun-ray-eight" d="M131.6,357.8l-22.6,22.6c-6.2,6.2-6.2,16.4,0,22.6s16.4,6.2,22.6,0l22.6-22.6c6.2-6.3,6.2-16.4,0-22.6 C147.9,351.6,137.8,351.6,131.6,357.8z"/> <path class="sun-ray-seven" d="M256,400c-8.8,0-16,7.2-16,16v32c0,8.8,7.2,16,16,16s16-7.2,16-16v-32C272,407.2,264.8,400,256,400z"/> <path class="sun-ray-six" d="M380.5,357.8c-6.3-6.2-16.4-6.2-22.6,0c-6.3,6.2-6.3,16.4,0,22.6l22.6,22.6c6.2,6.2,16.4,6.2,22.6,0 s6.2-16.4,0-22.6L380.5,357.8z"/> <path class="sun-ray-five" d="M448,240h-32c-8.8,0-16,7.2-16,16s7.2,16,16,16h32c8.8,0,16-7.2,16-16S456.8,240,448,240z"/> <path class="sun-ray-four" d="M380.4,154.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6s-16.4-6.2-22.6,0l-22.6,22.6c-6.2,6.2-6.2,16.4,0,22.6 C364.1,160.4,374.2,160.4,380.4,154.2z"/> <path class="sun-ray-three" d="M256,112c8.8,0,16-7.2,16-16V64c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C240,104.8,247.2,112,256,112z"/> <path class="sun-ray-two" d="M131.5,154.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L131.5,154.2z"/> <path class="sun-ray-one" d="M112,256c0-8.8-7.2-16-16-16H64c-8.8,0-16,7.2-16,16s7.2,16,16,16h32C104.8,272,112,264.8,112,256z"/> </svg> ', //sunny
			
			"02d":  '<svg class="sun-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-half" d="M127.8,259.1c3.1-4.3,6.5-8.4,10-12.3c-6-11.2-9.4-24-9.4-37.7c0-44.1,35.7-79.8,79.8-79.8 c40,0,73.1,29.4,78.9,67.7c11.4,2.3,22.4,5.7,32.9,10.4c-0.4-29.2-12-56.6-32.7-77.3C266.1,109,238,97.4,208.2,97.4 c-29.9,0-57.9,11.6-79.1,32.8c-21.1,21.1-32.8,49.2-32.8,79.1c0,17.2,3.9,33.9,11.2,48.9c1.5-0.1,3-0.1,4.4-0.1 C117.3,258,122.6,258.4,127.8,259.1z"/> <path class="cloud" d="M400,256c-5.3,0-10.6,0.4-15.8,1.1c-16.8-22.8-39-40.5-64.2-51.7c-10.5-4.6-21.5-8.1-32.9-10.4 c-10.1-2-20.5-3.1-31.1-3.1c-45.8,0-88.4,19.6-118.2,52.9c-3.5,3.9-6.9,8-10,12.3c-5.2-0.8-10.5-1.1-15.8-1.1c-1.5,0-3,0-4.4,0.1 C47.9,258.4,0,307.7,0,368c0,61.8,50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3 c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,256,400,256z M400,448 c-17.1,0-32.9-5.5-45.9-14.7C330.6,461.6,295.6,480,256,480c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7 c-44.2,0-80-35.8-80-80s35.8-80,80-80c7.8,0,15.4,1.2,22.5,3.3c2.7,0.8,5.4,1.7,8,2.8c4.5-8.7,9.9-16.9,16.2-24.4 C182,241.9,216.8,224,256,224c10.1,0,20,1.2,29.4,3.5c10.6,2.5,20.7,6.4,30.1,11.4c23.2,12.4,42.1,31.8,54.1,55.2 c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,448,400,448z"/> <path class="ray ray-one" d="M16,224h32c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,224,16,224z"/> <path class="ray ray-two" d="M83.5,106.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6L83.5,60.9c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L83.5,106.2z"/> <path class="ray ray-three" d="M208,64c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C192,56.8,199.2,64,208,64z"/> <path class="ray ray-four" d="M332.4,106.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6c-6.2-6.2-16.4-6.2-22.6,0l-22.6,22.6 c-6.2,6.2-6.2,16.4,0,22.6S326.2,112.4,332.4,106.2z"/> <path class="ray ray-five" d="M352,208c0,8.8,7.2,16,16,16h32c8.8,0,16-7.2,16-16s-7.2-16-16-16h-32C359.2,192,352,199.2,352,208z"/> </svg>', //cloudy


			"03d":  '<svg class="sun-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-half" d="M127.8,259.1c3.1-4.3,6.5-8.4,10-12.3c-6-11.2-9.4-24-9.4-37.7c0-44.1,35.7-79.8,79.8-79.8 c40,0,73.1,29.4,78.9,67.7c11.4,2.3,22.4,5.7,32.9,10.4c-0.4-29.2-12-56.6-32.7-77.3C266.1,109,238,97.4,208.2,97.4 c-29.9,0-57.9,11.6-79.1,32.8c-21.1,21.1-32.8,49.2-32.8,79.1c0,17.2,3.9,33.9,11.2,48.9c1.5-0.1,3-0.1,4.4-0.1 C117.3,258,122.6,258.4,127.8,259.1z"/> <path class="cloud" d="M400,256c-5.3,0-10.6,0.4-15.8,1.1c-16.8-22.8-39-40.5-64.2-51.7c-10.5-4.6-21.5-8.1-32.9-10.4 c-10.1-2-20.5-3.1-31.1-3.1c-45.8,0-88.4,19.6-118.2,52.9c-3.5,3.9-6.9,8-10,12.3c-5.2-0.8-10.5-1.1-15.8-1.1c-1.5,0-3,0-4.4,0.1 C47.9,258.4,0,307.7,0,368c0,61.8,50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3 c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,256,400,256z M400,448 c-17.1,0-32.9-5.5-45.9-14.7C330.6,461.6,295.6,480,256,480c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7 c-44.2,0-80-35.8-80-80s35.8-80,80-80c7.8,0,15.4,1.2,22.5,3.3c2.7,0.8,5.4,1.7,8,2.8c4.5-8.7,9.9-16.9,16.2-24.4 C182,241.9,216.8,224,256,224c10.1,0,20,1.2,29.4,3.5c10.6,2.5,20.7,6.4,30.1,11.4c23.2,12.4,42.1,31.8,54.1,55.2 c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,448,400,448z"/> <path class="ray ray-one" d="M16,224h32c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,224,16,224z"/> <path class="ray ray-two" d="M83.5,106.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6L83.5,60.9c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L83.5,106.2z"/> <path class="ray ray-three" d="M208,64c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C192,56.8,199.2,64,208,64z"/> <path class="ray ray-four" d="M332.4,106.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6c-6.2-6.2-16.4-6.2-22.6,0l-22.6,22.6 c-6.2,6.2-6.2,16.4,0,22.6S326.2,112.4,332.4,106.2z"/> <path class="ray ray-five" d="M352,208c0,8.8,7.2,16,16,16h32c8.8,0,16-7.2,16-16s-7.2-16-16-16h-32C359.2,192,352,199.2,352,208z"/> </svg>', //cloudy


			"04d": ' <svg class="windy-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <g class="cloud-wrap"> <path class="cloud" d="M417,166.1c-24-24.5-57.1-38.8-91.7-38.8c-34.6,0-67.7,14.2-91.7,38.8c-52.8,2.5-95,46.2-95,99.6 c0,55,44.7,99.7,99.7,99.7c5.8,0,11.6-0.5,17.3-1.5c20.7,13.5,44.9,20.9,69.7,20.9c24.9,0,49.1-7.3,69.8-20.9 c5.7,1,11.5,1.5,17.3,1.5c54.9,0,99.6-44.7,99.6-99.7C512,212.3,469.8,168.5,417,166.1z M412.4,333.3c-8.3,0-16.4-1.5-24-4.4 c-17.5,15.2-39.8,23.8-63.1,23.8c-23.2,0-45.5-8.5-63-23.8c-7.6,2.9-15.8,4.4-24,4.4c-37.3,0-67.7-30.4-67.7-67.7 c0-37.3,30.4-67.7,67.7-67.7c3.2,0,6.4,0.2,9.5,0.7c18.1-24.6,46.5-39.4,77.5-39.4c30.9,0,59.4,14.8,77.5,39.4 c3.1-0.5,6.3-0.7,9.6-0.7c37.3,0,67.6,30.4,67.6,67.7C480,303,449.7,333.3,412.4,333.3z"/> </g> <path class="wind-three" d="M144,352H16c-8.8,0-16,7.2-16,16s7.2,16,16,16h128c8.8,0,16-7.2,16-16S152.8,352,144,352z"/> <path class="wind-two" d="M16,320h94c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,320,16,320z"/> <path class="wind-one" d="M16,256h64c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,256,16,256z"/> </svg>' , //cloudy


			"09d": '<svg class="rain-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="raindrop-one" d="M96,384c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S96,366.3,96,384z"/> <path class="raindrop-two" d="M225,480c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S225,462.3,225,480z"/> <path class="raindrop-three" d="M352,448c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S352,430.3,352,448z"/> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z M400,256c-17.1,0-32.9-5.5-45.9-14.7C330.6,269.6,295.6,288,256,288c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,256,400,256z"/> </svg>' , // rain, Shower			


			"10d": '<svg class="rain-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="raindrop-one" d="M96,384c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S96,366.3,96,384z"/> <path class="raindrop-two" d="M225,480c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S225,462.3,225,480z"/> <path class="raindrop-three" d="M352,448c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S352,430.3,352,448z"/> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z M400,256c-17.1,0-32.9-5.5-45.9-14.7C330.6,269.6,295.6,288,256,288c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,256,400,256z"/> </svg>' , // rain, Shower			


			"11d":  '<svg class="thunder-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c12.3,10.7,26.2,19,40.9,25.4l24.9-24.9c-23.5-7.6-44.2-21.3-59.6-39.9c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80s-35.8,80-80,80c-17.1,0-32.9-5.5-45.9-14.7c-10.4,12.5-23.3,22.7-37.6,30.6L303,312.2c20.9-6.6,40.5-16.9,57.3-31.6c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z"/> <polygon class="bolt" points="192,352 224,384 192,480 288,384 256,352 288,256 "/> </svg>', // thunderstorm
			//snow used to be here
			//fog used to be here

			
			"01n": '<div class="stage"><svg class="sunshine" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-full" d="M256,144c-61.8,0-112,50.2-112,112s50.2,112,112,112s112-50.2,112-112S317.8,144,256,144z M256,336 c-44.2,0-80-35.8-80-80s35.8-80,80-80s80,35.8,80,80S300.2,336,256,336z"/> <path class="sun-ray-eight" d="M131.6,357.8l-22.6,22.6c-6.2,6.2-6.2,16.4,0,22.6s16.4,6.2,22.6,0l22.6-22.6c6.2-6.3,6.2-16.4,0-22.6 C147.9,351.6,137.8,351.6,131.6,357.8z"/> <path class="sun-ray-seven" d="M256,400c-8.8,0-16,7.2-16,16v32c0,8.8,7.2,16,16,16s16-7.2,16-16v-32C272,407.2,264.8,400,256,400z"/> <path class="sun-ray-six" d="M380.5,357.8c-6.3-6.2-16.4-6.2-22.6,0c-6.3,6.2-6.3,16.4,0,22.6l22.6,22.6c6.2,6.2,16.4,6.2,22.6,0 s6.2-16.4,0-22.6L380.5,357.8z"/> <path class="sun-ray-five" d="M448,240h-32c-8.8,0-16,7.2-16,16s7.2,16,16,16h32c8.8,0,16-7.2,16-16S456.8,240,448,240z"/> <path class="sun-ray-four" d="M380.4,154.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6s-16.4-6.2-22.6,0l-22.6,22.6c-6.2,6.2-6.2,16.4,0,22.6 C364.1,160.4,374.2,160.4,380.4,154.2z"/> <path class="sun-ray-three" d="M256,112c8.8,0,16-7.2,16-16V64c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C240,104.8,247.2,112,256,112z"/> <path class="sun-ray-two" d="M131.5,154.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L131.5,154.2z"/> <path class="sun-ray-one" d="M112,256c0-8.8-7.2-16-16-16H64c-8.8,0-16,7.2-16,16s7.2,16,16,16h32C104.8,272,112,264.8,112,256z"/> </svg> ', //Night clear
			

			"02n":  '<div class="stage"><svg class="sun-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-half" d="M127.8,259.1c3.1-4.3,6.5-8.4,10-12.3c-6-11.2-9.4-24-9.4-37.7c0-44.1,35.7-79.8,79.8-79.8 c40,0,73.1,29.4,78.9,67.7c11.4,2.3,22.4,5.7,32.9,10.4c-0.4-29.2-12-56.6-32.7-77.3C266.1,109,238,97.4,208.2,97.4 c-29.9,0-57.9,11.6-79.1,32.8c-21.1,21.1-32.8,49.2-32.8,79.1c0,17.2,3.9,33.9,11.2,48.9c1.5-0.1,3-0.1,4.4-0.1 C117.3,258,122.6,258.4,127.8,259.1z"/> <path class="cloud" d="M400,256c-5.3,0-10.6,0.4-15.8,1.1c-16.8-22.8-39-40.5-64.2-51.7c-10.5-4.6-21.5-8.1-32.9-10.4 c-10.1-2-20.5-3.1-31.1-3.1c-45.8,0-88.4,19.6-118.2,52.9c-3.5,3.9-6.9,8-10,12.3c-5.2-0.8-10.5-1.1-15.8-1.1c-1.5,0-3,0-4.4,0.1 C47.9,258.4,0,307.7,0,368c0,61.8,50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3 c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,256,400,256z M400,448 c-17.1,0-32.9-5.5-45.9-14.7C330.6,461.6,295.6,480,256,480c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7 c-44.2,0-80-35.8-80-80s35.8-80,80-80c7.8,0,15.4,1.2,22.5,3.3c2.7,0.8,5.4,1.7,8,2.8c4.5-8.7,9.9-16.9,16.2-24.4 C182,241.9,216.8,224,256,224c10.1,0,20,1.2,29.4,3.5c10.6,2.5,20.7,6.4,30.1,11.4c23.2,12.4,42.1,31.8,54.1,55.2 c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,448,400,448z"/> <path class="ray ray-one" d="M16,224h32c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,224,16,224z"/> <path class="ray ray-two" d="M83.5,106.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6L83.5,60.9c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L83.5,106.2z"/> <path class="ray ray-three" d="M208,64c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C192,56.8,199.2,64,208,64z"/> <path class="ray ray-four" d="M332.4,106.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6c-6.2-6.2-16.4-6.2-22.6,0l-22.6,22.6 c-6.2,6.2-6.2,16.4,0,22.6S326.2,112.4,332.4,106.2z"/> <path class="ray ray-five" d="M352,208c0,8.8,7.2,16,16,16h32c8.8,0,16-7.2,16-16s-7.2-16-16-16h-32C359.2,192,352,199.2,352,208z"/> </svg>', //cloudy


			"03n":  '<div class="stage"><svg class="sun-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-half" d="M127.8,259.1c3.1-4.3,6.5-8.4,10-12.3c-6-11.2-9.4-24-9.4-37.7c0-44.1,35.7-79.8,79.8-79.8 c40,0,73.1,29.4,78.9,67.7c11.4,2.3,22.4,5.7,32.9,10.4c-0.4-29.2-12-56.6-32.7-77.3C266.1,109,238,97.4,208.2,97.4 c-29.9,0-57.9,11.6-79.1,32.8c-21.1,21.1-32.8,49.2-32.8,79.1c0,17.2,3.9,33.9,11.2,48.9c1.5-0.1,3-0.1,4.4-0.1 C117.3,258,122.6,258.4,127.8,259.1z"/> <path class="cloud" d="M400,256c-5.3,0-10.6,0.4-15.8,1.1c-16.8-22.8-39-40.5-64.2-51.7c-10.5-4.6-21.5-8.1-32.9-10.4 c-10.1-2-20.5-3.1-31.1-3.1c-45.8,0-88.4,19.6-118.2,52.9c-3.5,3.9-6.9,8-10,12.3c-5.2-0.8-10.5-1.1-15.8-1.1c-1.5,0-3,0-4.4,0.1 C47.9,258.4,0,307.7,0,368c0,61.8,50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3 c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,256,400,256z M400,448 c-17.1,0-32.9-5.5-45.9-14.7C330.6,461.6,295.6,480,256,480c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7 c-44.2,0-80-35.8-80-80s35.8-80,80-80c7.8,0,15.4,1.2,22.5,3.3c2.7,0.8,5.4,1.7,8,2.8c4.5-8.7,9.9-16.9,16.2-24.4 C182,241.9,216.8,224,256,224c10.1,0,20,1.2,29.4,3.5c10.6,2.5,20.7,6.4,30.1,11.4c23.2,12.4,42.1,31.8,54.1,55.2 c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,448,400,448z"/> <path class="ray ray-one" d="M16,224h32c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,224,16,224z"/> <path class="ray ray-two" d="M83.5,106.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6L83.5,60.9c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L83.5,106.2z"/> <path class="ray ray-three" d="M208,64c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C192,56.8,199.2,64,208,64z"/> <path class="ray ray-four" d="M332.4,106.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6c-6.2-6.2-16.4-6.2-22.6,0l-22.6,22.6 c-6.2,6.2-6.2,16.4,0,22.6S326.2,112.4,332.4,106.2z"/> <path class="ray ray-five" d="M352,208c0,8.8,7.2,16,16,16h32c8.8,0,16-7.2,16-16s-7.2-16-16-16h-32C359.2,192,352,199.2,352,208z"/> </svg>', //cloudy	


			"04n":  '<div class="stage"><svg class="sun-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="sun-half" d="M127.8,259.1c3.1-4.3,6.5-8.4,10-12.3c-6-11.2-9.4-24-9.4-37.7c0-44.1,35.7-79.8,79.8-79.8 c40,0,73.1,29.4,78.9,67.7c11.4,2.3,22.4,5.7,32.9,10.4c-0.4-29.2-12-56.6-32.7-77.3C266.1,109,238,97.4,208.2,97.4 c-29.9,0-57.9,11.6-79.1,32.8c-21.1,21.1-32.8,49.2-32.8,79.1c0,17.2,3.9,33.9,11.2,48.9c1.5-0.1,3-0.1,4.4-0.1 C117.3,258,122.6,258.4,127.8,259.1z"/> <path class="cloud" d="M400,256c-5.3,0-10.6,0.4-15.8,1.1c-16.8-22.8-39-40.5-64.2-51.7c-10.5-4.6-21.5-8.1-32.9-10.4 c-10.1-2-20.5-3.1-31.1-3.1c-45.8,0-88.4,19.6-118.2,52.9c-3.5,3.9-6.9,8-10,12.3c-5.2-0.8-10.5-1.1-15.8-1.1c-1.5,0-3,0-4.4,0.1 C47.9,258.4,0,307.7,0,368c0,61.8,50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3 c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,256,400,256z M400,448 c-17.1,0-32.9-5.5-45.9-14.7C330.6,461.6,295.6,480,256,480c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7 c-44.2,0-80-35.8-80-80s35.8-80,80-80c7.8,0,15.4,1.2,22.5,3.3c2.7,0.8,5.4,1.7,8,2.8c4.5-8.7,9.9-16.9,16.2-24.4 C182,241.9,216.8,224,256,224c10.1,0,20,1.2,29.4,3.5c10.6,2.5,20.7,6.4,30.1,11.4c23.2,12.4,42.1,31.8,54.1,55.2 c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,448,400,448z"/> <path class="ray ray-one" d="M16,224h32c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,224,16,224z"/> <path class="ray ray-two" d="M83.5,106.2c6.3,6.2,16.4,6.2,22.6,0c6.3-6.2,6.3-16.4,0-22.6L83.5,60.9c-6.2-6.2-16.4-6.2-22.6,0 c-6.2,6.2-6.2,16.4,0,22.6L83.5,106.2z"/> <path class="ray ray-three" d="M208,64c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16s-16,7.2-16,16v32C192,56.8,199.2,64,208,64z"/> <path class="ray ray-four" d="M332.4,106.2l22.6-22.6c6.2-6.2,6.2-16.4,0-22.6c-6.2-6.2-16.4-6.2-22.6,0l-22.6,22.6 c-6.2,6.2-6.2,16.4,0,22.6S326.2,112.4,332.4,106.2z"/> <path class="ray ray-five" d="M352,208c0,8.8,7.2,16,16,16h32c8.8,0,16-7.2,16-16s-7.2-16-16-16h-32C359.2,192,352,199.2,352,208z"/> </svg>', //cloudy
						
			"09n": '<div class="stage"><svg class="rain-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="raindrop-one" d="M96,384c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S96,366.3,96,384z"/> <path class="raindrop-two" d="M225,480c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S225,462.3,225,480z"/> <path class="raindrop-three" d="M352,448c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S352,430.3,352,448z"/> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z M400,256c-17.1,0-32.9-5.5-45.9-14.7C330.6,269.6,295.6,288,256,288c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,256,400,256z"/> </svg>' , // rain, Shower


			"10n": '<div class="stage"><svg class="rain-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path class="raindrop-one" d="M96,384c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S96,366.3,96,384z"/> <path class="raindrop-two" d="M225,480c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S225,462.3,225,480z"/> <path class="raindrop-three" d="M352,448c0,17.7,14.3,32,32,32s32-14.3,32-32s-32-64-32-64S352,430.3,352,448z"/> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c29,25.2,65.8,39.3,104.3,39.3c38.5,0,75.3-14.1,104.3-39.3c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z M400,256c-17.1,0-32.9-5.5-45.9-14.7C330.6,269.6,295.6,288,256,288c-39.6,0-74.6-18.4-98.1-46.7c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80S444.2,256,400,256z"/> </svg>' , // rain, Shower			
	
	
			"11n":  '<div class="stage"><svg class="thunder-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <path d="M400,64c-5.3,0-10.6,0.4-15.8,1.1C354.3,24.4,307.2,0,256,0s-98.3,24.4-128.2,65.1c-5.2-0.8-10.5-1.1-15.8-1.1C50.2,64,0,114.2,0,176s50.2,112,112,112c13.7,0,27.1-2.5,39.7-7.3c12.3,10.7,26.2,19,40.9,25.4l24.9-24.9c-23.5-7.6-44.2-21.3-59.6-39.9c-13,9.2-28.8,14.7-45.9,14.7c-44.2,0-80-35.8-80-80s35.8-80,80-80c10.8,0,21.1,2.2,30.4,6.1C163.7,60.7,206.3,32,256,32s92.3,28.7,113.5,70.1c9.4-3.9,19.7-6.1,30.5-6.1c44.2,0,80,35.8,80,80s-35.8,80-80,80c-17.1,0-32.9-5.5-45.9-14.7c-10.4,12.5-23.3,22.7-37.6,30.6L303,312.2c20.9-6.6,40.5-16.9,57.3-31.6c12.6,4.8,26,7.3,39.7,7.3c61.8,0,112-50.2,112-112S461.8,64,400,64z"/> <polygon class="bolt" points="192,352 224,384 192,480 288,384 256,352 288,256 "/> </svg>', // thunderstorm
			

			// Night Snow used to be here		
			"50n": ' <div class="stage"><svg class="windy-cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"> <g class="cloud-wrap"> <path class="cloud" d="M417,166.1c-24-24.5-57.1-38.8-91.7-38.8c-34.6,0-67.7,14.2-91.7,38.8c-52.8,2.5-95,46.2-95,99.6 c0,55,44.7,99.7,99.7,99.7c5.8,0,11.6-0.5,17.3-1.5c20.7,13.5,44.9,20.9,69.7,20.9c24.9,0,49.1-7.3,69.8-20.9 c5.7,1,11.5,1.5,17.3,1.5c54.9,0,99.6-44.7,99.6-99.7C512,212.3,469.8,168.5,417,166.1z M412.4,333.3c-8.3,0-16.4-1.5-24-4.4 c-17.5,15.2-39.8,23.8-63.1,23.8c-23.2,0-45.5-8.5-63-23.8c-7.6,2.9-15.8,4.4-24,4.4c-37.3,0-67.7-30.4-67.7-67.7 c0-37.3,30.4-67.7,67.7-67.7c3.2,0,6.4,0.2,9.5,0.7c18.1-24.6,46.5-39.4,77.5-39.4c30.9,0,59.4,14.8,77.5,39.4 c3.1-0.5,6.3-0.7,9.6-0.7c37.3,0,67.6,30.4,67.6,67.7C480,303,449.7,333.3,412.4,333.3z"/> </g> <path class="wind-three" d="M144,352H16c-8.8,0-16,7.2-16,16s7.2,16,16,16h128c8.8,0,16-7.2,16-16S152.8,352,144,352z"/> <path class="wind-two" d="M16,320h94c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,320,16,320z"/> <path class="wind-one" d="M16,256h64c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,256,16,256z"/> </svg>' , //cloudy
		}
	},

	// create a variable for the first upcoming calendaar event. Used if no location is specified.
	firstEvent: false,

	// create a variable to hold the location name based on the API result.
	fetchedLocatioName: "",

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles: function() {
		return ["weather-icons.css", "currentweather.css"];
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the defaut modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionairy.
		// If you're trying to build yiur own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.windSpeed = null;
		this.windDirection = null;
		this.sunriseSunsetTime = null;
		this.sunriseSunsetIcon = null;
		this.temperature = null;
		this.weatherType = null;
		this.weatherHTMLType = null;
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

	},

	// add extra information of current weather
	// windDirection, humidity, sunrise and sunset
	addExtraInfoWeather: function(wrapper) {

		var small = document.createElement("div");
		small.className = "normal medium";


		var windIcon = document.createElement("span");
		windIcon.className = "wi wi-strong-wind dimmed";
		small.appendChild(windIcon);

		var windSpeed = document.createElement("span");
		windSpeed.innerHTML = " " + this.windSpeed;
		small.appendChild(windSpeed);

		if (this.config.showWindDirection) {
			var windDirection = document.createElement("sup");
			windDirection.innerHTML = " " + this.translate(this.windDirection);
			small.appendChild(windDirection);
		}
		var spacer = document.createElement("span");
		spacer.innerHTML = "&nbsp;";
		small.appendChild(spacer);

		if (this.config.showHumidity) {
			var humidity = document.createElement("span");
			humidity.innerHTML = this.humidity;

			var spacer = document.createElement("sup");
			spacer.innerHTML = "&nbsp;";

			var humidityIcon = document.createElement("sup");
			humidityIcon.className = "wi wi-humidity humidityIcon";
			humidityIcon.innerHTML = "&nbsp;";

			small.appendChild(humidity);
			small.appendChild(spacer);
			small.appendChild(humidityIcon);
		}

		var sunriseSunsetIcon = document.createElement("span");
		sunriseSunsetIcon.className = "wi dimmed " + this.sunriseSunsetIcon;
		small.appendChild(sunriseSunsetIcon);

		var sunriseSunsetTime = document.createElement("span");
		sunriseSunsetTime.innerHTML = " " + this.sunriseSunsetTime;
		small.appendChild(sunriseSunsetTime);

		// wrapper.appendChild(small);
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.appid === "") {
			wrapper.innerHTML = "Please set the correct openweather <i>appid</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (this.config.onlyTemp === false) {
			this.addExtraInfoWeather(wrapper);
		}

		var large = document.createElement("div");
		large.className = "medium light";

		var weatherIcon = document.createElement("div");
		//weatherIcon.className = "icon " + this.weatherType;
		weatherIcon.innerHTML = this.weatherHTMLType;
		//console.log(weatherIcon.innerHTML);
		large.appendChild(weatherIcon);
	
		var temperature = document.createElement("span");
		temperature.className = "bright";
		temperature.innerHTML = " " + this.temperature + "&deg;";
	    large.appendChild(temperature);

		wrapper.appendChild(large);
		return wrapper;
	},

	// Override getHeader method.
	getHeader: function() {
		if (this.config.appendLocationNameToHeader) {
			return this.data.header + " " + this.fetchedLocatioName;
		}

		return this.data.header;
	},

	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
		if (notification === "DOM_OBJECTS_CREATED") {
			if (this.config.appendLocationNameToHeader) {
				this.hide(0, {lockString: this.identifier});
			}
		}
		if (notification === "CALENDAR_EVENTS") {
			var senderClasses = sender.data.classes.toLowerCase().split(" ");
			if (senderClasses.indexOf(this.config.calendarClass.toLowerCase()) !== -1) {
				var lastEvent =  this.firstEvent;
				this.firstEvent = false;

				for (e in payload) {
					var event = payload[e];
					if (event.location || event.geo) {
						this.firstEvent = event;
						//Log.log("First upcoming event with location: ", event);
						break;
					}
				}
			}
		}
	},

	/* updateWeather(compliments)
	 * Requests new data from openweather.org.
	 * Calls processWeather on succesfull response.
	 */
	updateWeather: function() {
		if (this.config.appid === "") {
			Log.error("CurrentWeather: APPID not set!");
			return;
		}

		var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.weatherEndpoint + this.getParams();
		var self = this;
		var retry = true;

		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, true);
		weatherRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processWeather(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);

					Log.error(self.name + ": Incorrect APPID.");
					retry = true;
				} else {
					Log.error(self.name + ": Could not load weather.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		weatherRequest.send();
	},

	/* getParams(compliments)
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params.
	 */
	getParams: function() {
		var params = "?";
		if(this.config.locationID) {
			params += "id=" + this.config.locationID;
		} else if(this.config.location) {
			params += "q=" + this.config.location;
		} else if (this.firstEvent && this.firstEvent.geo) {
			params += "lat=" + this.firstEvent.geo.lat + "&lon=" + this.firstEvent.geo.lon
		} else if (this.firstEvent && this.firstEvent.location) {
			params += "q=" + this.firstEvent.location;
		} else {
			this.hide(this.config.animationSpeed, {lockString:this.identifier});
			return;
		}

		params += "&units=" + this.config.units;
		params += "&lang=" + this.config.lang;
		params += "&APPID=" + this.config.appid;

		return params;
	},

	/* processWeather(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form openweather.org.
	 */
	processWeather: function(data) {

		if (!data || !data.main || !data.main.temp) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}

		this.humidity = parseFloat(data.main.humidity);
		this.temperature = this.roundValue(data.main.temp);

		if (this.config.useBeaufort){
			this.windSpeed = this.ms2Beaufort(this.roundValue(data.wind.speed));
		}else {
			this.windSpeed = parseFloat(data.wind.speed).toFixed(0);
		}


		this.windDirection = this.deg2Cardinal(data.wind.deg);
		this.weatherType = this.config.iconTable[data.weather[0].icon];
		this.weatherHTMLType = this.config.iconHTMLTable[data.weather[0].icon];
		var now = new Date();
		var sunrise = new Date(data.sys.sunrise * 1000);
		var sunset = new Date(data.sys.sunset * 1000);

		// The moment().format('h') method has a bug on the Raspberry Pi.
		// So we need to generate the timestring manually.
		// See issue: https://github.com/MichMich/MagicMirror/issues/181
		var sunriseSunsetDateObject = (sunrise < now && sunset > now) ? sunset : sunrise;
		var timeString = moment(sunriseSunsetDateObject).format("HH:mm");
		if (this.config.timeFormat !== 24) {
			//var hours = sunriseSunsetDateObject.getHours() % 12 || 12;
			if (this.config.showPeriod) {
				if (this.config.showPeriodUpper) {
					//timeString = hours + moment(sunriseSunsetDateObject).format(':mm A');
					timeString = moment(sunriseSunsetDateObject).format("h:mm A");
				} else {
					//timeString = hours + moment(sunriseSunsetDateObject).format(':mm a');
					timeString = moment(sunriseSunsetDateObject).format("h:mm a");
				}
			} else {
				//timeString = hours + moment(sunriseSunsetDateObject).format(':mm');
				timeString = moment(sunriseSunsetDateObject).format("h:mm");
			}
		}

		this.sunriseSunsetTime = timeString;
		this.sunriseSunsetIcon = (sunrise < now && sunset > now) ? "wi-sunset" : "wi-sunrise";


		this.show(this.config.animationSpeed, {lockString:this.identifier});
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
		this.sendNotification("CURRENTWEATHER_DATA", {data: data});
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateWeather();
		}, nextLoad);
	},

	/* ms2Beaufort(ms)
	 * Converts m2 to beaufort (windspeed).
	 *
	 * argument ms number - Windspeed in m/s.
	 *
	 * return number - Windspeed in beaufort.
	 */
	ms2Beaufort: function(ms) {
		var kmh = ms * 60 * 60 / 1000;
		var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
		for (var beaufort in speeds) {
			var speed = speeds[beaufort];
			if (speed > kmh) {
				return beaufort;
			}
		}
		return 12;
	},

	deg2Cardinal: function(deg) {
		if (deg>11.25 && deg<=33.75){
			return "NNE";
		} else if (deg > 33.75 && deg <= 56.25) {
			return "NE";
		} else if (deg > 56.25 && deg <= 78.75) {
			return "ENE";
		} else if (deg > 78.75 && deg <= 101.25) {
			return "E";
		} else if (deg > 101.25 && deg <= 123.75) {
			return "ESE";
		} else if (deg > 123.75 && deg <= 146.25) {
			return "SE";
		} else if (deg > 146.25 && deg <= 168.75) {
			return "SSE";
		} else if (deg > 168.75 && deg <= 191.25) {
			return "S";
		} else if (deg > 191.25 && deg <= 213.75) {
			return "SSW";
		} else if (deg > 213.75 && deg <= 236.25) {
			return "SW";
		} else if (deg > 236.25 && deg <= 258.75) {
			return "WSW";
		} else if (deg > 258.75 && deg <= 281.25) {
			return "W";
		} else if (deg > 281.25 && deg <= 303.75) {
			return "WNW";
		} else if (deg > 303.75 && deg <= 326.25) {
			return "NW";
		} else if (deg > 326.25 && deg <= 348.75) {
			return "NNW";
		} else {
			return "N";
		}
	},

	/* function(temperature)
	 * Rounds a temperature to 1 decimal or integer (depending on config.roundTemp).
	 *
	 * argument temperature number - Temperature.
	 *
	 * return number - Rounded Temperature.
	 */
	roundValue: function(temperature) {
		var decimals = this.config.roundTemp ? 0 : 1;
		return parseFloat(temperature).toFixed(decimals);
	}
});




