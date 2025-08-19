import { apiGetItemDetails } from "../api/apiGetItemDetails.js";
import { apiDeleteItem } from "../api/apiDeleteItem.js";
import { apiUpdateItem } from "../api/apiUpdateItem.js";

function getHash() {
  const hash = window.location.hash.replace("#", "");
  return Number(hash);
}

function ErrorBanner(error) {
  return `<hgroup>
    <h2>Error Loading Product</h2>
    <p>${error.message}</p>
  </hgroup>`;
}

const lowStockThreshold = 5;

function getStockStatusClass(stock) {
  if (stock === 0) {
    return "out-of-stock";
  }
  if (stock < lowStockThreshold) {
    return "low-stock";
  }
  return "in-stock";
}

function ItemDetails(item) {
  return `<article>
      <header><h2>${item.name}</h2></header>
      <p>Category: ${item.category}</p>
      <p>Stock: <span class="${getStockStatusClass(
        item.stock
      )}" id="stock-value">
        ${item.stock}
      </span></p>
      <footer>
        <button id="restock-item">Restock</button>
        <button id="delete-item" class="secondary outline">Remove</button>
      </footer>
    </article>`;
}

function ItemDeleteSuccess() {
  return `<hgroup>
      <h2>Item Deleted</h2>
      <p>The item has been successfully deleted.</p>
      <a href="/">Back to home</a> 
    </hgroup>`;
}

async function deleteItem() {
  const id = getHash();
  const { error } = await apiDeleteItem(id);

  if (error) {
    document.getElementById("app").innerHTML = ErrorBanner(error);
    return;
  }

  document.getElementById("app").innerHTML = ItemDeleteSuccess();
}

async function restockItem() {
  const app = document.getElementById("app");
  const id = getHash();
  const { error, data } = await apiGetItemDetails(id);

  if (error) {
    app.innerHTML = ErrorBanner(error);
    return;
  }

  const newStock = data.stock + 1;

  const { error: updateError, data: updateItem } = await apiUpdateItem(id, {
    stock: newStock,
  });

  if (updateError) {
    app.innerHTML = ErrorBanner(updateError);
    return;
  }

  const stockElement = document.getElementById("stock-value");
  stockElement.innerText = `${updateItem.stock}`;

  const stockValue = Number(stockElement.textContent);

  if (stockValue === 0) {
    stockElement.style.color = "red";
  } else if (stockValue < lowStockThreshold) {
    stockElement.style.color = "yellow";
  } else {
    stockElement.style.color = "white";
  }
}

function attachButtonHandlers() {
  const removeBtnElement = document.getElementById("delete-item");
  const restockBtnElement = document.getElementById("restock-item");

  removeBtnElement.addEventListener("click", deleteItem);
  restockBtnElement.addEventListener("click", restockItem);
}

export default async function render() {
  const app = document.getElementById("app");
  const id = getHash();
  const { error, data } = await apiGetItemDetails(id);

  if (error) {
    app.innerHTML = ErrorBanner(error);
    return;
  }

  app.innerHTML = ItemDetails(data);
  attachButtonHandlers();
}
