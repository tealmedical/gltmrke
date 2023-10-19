import { Controller } from "@hotwired/stimulus"

const HOLLDYB = "1d692e16-0ff9-4b3f-938e-1a755682fbcd"

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
      const anchor = clone.querySelector("a")
      const image = clone.querySelector("img")
      anchor.textContent = store.name;
      anchor.href = `/store.html#${store.id}`;
      this.outputTarget.appendChild(clone);
    }
  }
}