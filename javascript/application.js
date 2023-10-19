import { Application } from "@hotwired/stimulus"
import ClearancesController from "./controllers/clearances_controller.js"
import HelloController from "./controllers/hello_controller.js"

window.Stimulus = Application.start()

Stimulus.register("clearances", ClearancesController)
Stimulus.register("hello", HelloController)