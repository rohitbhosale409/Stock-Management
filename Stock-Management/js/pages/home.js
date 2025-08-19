import { apiGetItems } from "../api/apiGetItems.js";

function ErrorBanner(error) {
  return `<hgroup>
    <h2>Error Loading Product</h2>
    <p>${error.message}</p>
  </hgroup>`;
}

const lowStockThreshold = 5;

function lowStockAnalysis(stock) {
  if (stock === 0) return "out-of-stock";
  if (stock < lowStockThreshold) return "low-stock";
  return "in-stock";
}

function ItemRow(product) {
  return `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td class="${lowStockAnalysis(product.stock)}">${product.stock}</td>
      <td><a href="details#${product.id}">View</a></td>
    </tr>
  `;
}

function ItemTable(items) {
  const itemRows = items.map(ItemRow).join("");
  return `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    `;
}

export default async function render() {
  const app = document.getElementById("app");

  app.innerHTML = `
<section class="grid">
  <div>
    <label for="filter-select">Filter:</label>
    <select id="filter-select">
      <option value="">All</option>
      <option value="out">Out of Stock</option>
      <option value="low">Low Stock</option>
    </select>
  </div>
  
  <div>
    <label for="sortby-select">Sort By:</label> 
    <select id="sortby-select">
      <option value="">None</option>
      <option value="name">Name</option>
      <option value="stock">Stock</option>
    </select>
  </div>

  <div>
    <label for="sortDir-select">Direction:</label> 
    <select id="sortDir-select">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</section>

<section id="table-container"></section>
`;

  const tableContainer = document.getElementById("table-container");
  const filterSelect = document.getElementById("filter-select");
  const sortBySelect = document.getElementById("sortby-select");
  const sortDirSelect = document.getElementById("sortDir-select");

  async function loadAndRender() {
    const filter = filterSelect.value;
    const sortBy = sortBySelect.value;
    const sortDir = sortDirSelect.value;

    const { error, data } = await apiGetItems({ filter, sortBy, sortDir });

    if (error) {
      tableContainer.innerHTML = ErrorBanner(error);
      return;
    }

    tableContainer.innerHTML = ItemTable(data);
  }

  filterSelect.addEventListener("change", loadAndRender);
  sortBySelect.addEventListener("change", loadAndRender);
  sortDirSelect.addEventListener("change", loadAndRender);

  loadAndRender();
}
