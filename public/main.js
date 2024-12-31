import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import isDev from "electron-is-dev";

import {
  getSnapshot,
  addItem,
  paginatedQuery,
  getDiscount,
  querybyParameter,
  updateItem,
  deleteItem,
  login,
  logout,
  addReceipt,
  searchWithDates,
} from "./Firebase.js";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 800,
    minWidth: 1280,
    icon: path.join(app.getAppPath(), "/public/icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  isDev
    ? mainWindow.loadURL("http://localhost:5173")
    : mainWindow.loadFile(
        path.join(app.getAppPath(), "/dist-react/index.html")
      );
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle("addItem", async (e, data) => {
  const { item, dest } = data;
  const message = await addItem(item, dest);
  return message;
});

ipcMain.handle("getCompInfo", async (e, data) => {
  const discount = await getDiscount(data.brandID);
  return discount;
});

ipcMain.handle("paginatedQuery", async (e, data) => {
  const { collectionName, lastdoc } = data;
  const items = await paginatedQuery(collectionName, lastdoc);
  return items;
});

ipcMain.handle("querybyParimeter", async (e, data) => {
  let items = await querybyParameter(data.searchValue, data.sender);
  return items;
});

ipcMain.handle("updateItem", async (e, data) => {
  const message = await updateItem(data.item, data.id, data.collectionName);
  return message;
});

ipcMain.handle("deleteItem", async (e, data) => {
  const message = await deleteItem(data.item.id, data.collectionName);
  return message;
});

ipcMain.handle("dropdown", async () => {
  const comps = await getSnapshot({ collectionName: "brands" });
  let dropdown = [];
  comps.forEach((comp) => {
    dropdown.push({
      value: comp.id,
      label: comp.name,
    });
  });
  return dropdown;
});

ipcMain.handle("login", async (e, data) => {
  const { email, password } = data;
  const user = await login(email, password);
  return user;
});

ipcMain.handle("logout", async () => {
  const message = await logout();
  return message;
});

ipcMain.handle("create-receipt", async (e, data) => {
  const message = await addReceipt(data);
  return message;
});

ipcMain.handle("searchWithDates", async (e, data) => {
  const { fDate, lDate } = data;
  const list = await searchWithDates(fDate, lDate);
  return list;
});
