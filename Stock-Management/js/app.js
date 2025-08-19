import themeSwitcher from "./lib/theme-switcher.js";
import inventoryAPI from "./api/inventory.mock.server.js";
import router from "./routes.js";

router.start();

inventoryAPI();

function initializeApp() {
  themeSwitcher();
}

document.addEventListener("DOMcontentLoaded", initializeApp());
