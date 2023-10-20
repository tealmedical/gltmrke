import { Application } from "@hotwired/stimulus"
import ClearancesController from "./controllers/clearances_controller.js"
import HelloController from "./controllers/hello_controller.js"

window.Stimulus = Application.start()

Stimulus.register("clearances", ClearancesController)
Stimulus.register("hello", HelloController)

document.getElementById("geolocate").addEventListener("click", () => {
  function success(s) {
    console.log(s)

  }
  function error(e) {
    console.log(e)
  }
  navigator.geolocation.getCurrentPosition(success, error);
});