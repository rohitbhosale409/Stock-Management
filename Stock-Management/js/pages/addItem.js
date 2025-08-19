// pages/addItem.js
import { apiAddItem } from "../api/apiAddItem.js";

console.log("AddItem page loaded");

function ErrorBanner(error) {
  return `<hgroup>
    <h2>Error Adding Item</h2>
    <p>${error.message}</p>
  </hgroup>`;
}

function AddItemForm() {
  return `
    <h1>Add New Warehouse Item</h1>
    <form id="warehouse-form">
      <div>
        <label for="item-name">Item Name</label>
        <input type="text" id="item-name" placeholder="Enter item name" required />
      </div>
      <div>
        <label for="category">Category</label>
        <select id="category" required>
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label for="stock">Stock Quantity</label>
        <input type="number" id="stock" min="0" placeholder="Enter quantity" required />
      </div>
      <button type="submit">Add Item</button>
    </form>
  `;
}

function SuccessBanner(itemName) {
  return `<hgroup>
    <h2>Item Added Successfully</h2>
    <p>Item "${itemName}" has been added to the warehouse.</p>
    <a href="/">Back to Home</a>
  </hgroup>`;
}

function attachFormHandler() {
  const form = document.getElementById("warehouse-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("item-name").value.trim();
    const category = document.getElementById("category").value;
    const stock = parseInt(document.getElementById("stock").value, 10);

    if (!itemName || !category || isNaN(stock)) {
      alert("Please fill in all fields.");
      return;
    }

    const newItem = { name: itemName, category, stock };
    const { data, error } = await apiAddItem(newItem);

    if (error) {
      document.getElementById("app").innerHTML = ErrorBanner(error);
      return;
    }

    document.getElementById("app").innerHTML = SuccessBanner(data.name);
  });
}

export default async function render() {
  const app = document.getElementById("app");
  app.innerHTML = AddItemForm();
  attachFormHandler();
}
