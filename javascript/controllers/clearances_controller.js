import { Controller } from "@hotwired/stimulus"

const HOLLDYB = "1d692e16-0ff9-4b3f-938e-1a755682fbcd"

const HOST = "https://api.sallinggroup.com/v1/"

const TOKEN = "45e8f1b8-2092-4a9d-8308-a5faecbd1eff";

export default class extends Controller {
  static targets = ["name", "template", "output"]

  connect() {
    const id = window.location.hash.substring(1);
    this.load(id);
  }

  async load(storeId) {
    const response = await fetch(`${HOST}food-waste/${storeId}`, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    })
    const { store, clearances } = await response.json();
    this.nameTarget.textContent = store.name;
    for (const clearance of clearances) {
      this.insert(clearance)
    }
  }

  insert(clearance) {
    const clone = this.templateTarget.content.cloneNode(true);
    const h2 = clone.querySelector("h2")
    const img = clone.querySelector("img")
    h2.textContent = clearance.product.description;
    img.src = clearance.product.image;
    this.outputTarget.appendChild(clone);
  }
}