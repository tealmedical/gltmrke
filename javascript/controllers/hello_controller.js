import { Controller } from "@hotwired/stimulus"

const HOST = "https://api.sallinggroup.com/v1/"

const TOKEN = "45e8f1b8-2092-4a9d-8308-a5faecbd1eff";

export default class extends Controller {
  static targets = ["zip", "template", "output"]

  async greet() {
    const response = await fetch(`${HOST}food-waste?zip=${this.zipTarget.value}`, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    })
    const result = await response.json();
    for (const { store, clearances } of result) {
      const clone = this.templateTarget.content.cloneNode(true);
      clone.querySelector("li").textContent = store.name;
      this.outputTarget.appendChild(clone);
    }
  }
}