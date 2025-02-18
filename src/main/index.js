import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { writeFile } from 'fs';
import { Server } from "socket.io";
const db = require('electron-db');
const fs = require('fs');
const os = require('os');
const localIpAddress = require("local-ip-address")
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    resizable: false,
    width: 980,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webSecurity: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  //mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  var win = null;
  app.on('browser-window-created', (_, window) => {
    win = window
    optimizer.watchWindowShortcuts(window)
  })


  const location = os.homedir() + "/extraResources"

  try {
    fs.mkdirSync(location)

  } catch (e) {
    console.log(e)
  }

  //const location = join(__dirname, '../../extraResources/' );
  // const location = process.env["HOME"]+"/file-sharing/dist/linux-unpacked/resources/extraResources"
  console.log(fs.existsSync(location))
  //const location = join(process.resourcesPath, 'extraResources');
  //const location = join(__dirname + '../../../extraResources/', '')
  console.log(location)
  console.log(fs.existsSync(location + "/users.json"))
  console.log(fs.existsSync(location + "/files.json"))
  db.createTable("conversation", location, (succ, msg) => {
    console.log("msg" + msg)
  })
  db.createTable("ips", location, (succ, msg) => {
    console.log("msg" + msg)
  })
  db.createTable("messages", location, (succ, msg) => {
    console.log("msg" + msg)
  })
  db.createTable("users", location, (succ, msg) => {
    console.log("msg" + msg)
  })
  db.createTable("files", location, (succ, msg) => {
    console.log("msg" + msg)
  })
  const io = new Server({
    cors: {
      origin: "*"
    },
    maxHttpBufferSize: 1e10
  });
  io.listen(3000)

  io.on("connection", (socket) => {
    socket.on("conversation", (data, callback) => {
      db.insertTableContent("conversation", location, data, (succ, msg) => {
        db.getAll("conversation", location, async (succ, result) => {
          var res = []
          for (let i in result) {
            const users = result[i].users
            if (data.users.includes(users[0]) || data.users.includes(users[1])) {
              res.push(result[i])
            }
          }
          win.webContents.send("sendconversation", { type: null, data: res })
        })
      })
    })
    socket.on("ipUser", (data, callback) => {
      win.webContents.send("getUserIp", { type: null, data: data })
    })
    socket.on("message", (data, callback) => {
      console.log("data is being sent")
      console.log(data)
      db.insertTableContent("messages", location, data, (succ, msg) => {
        db.getRows('messages', location, { conversation: data.conversation }, (succ, result) => {
          console.log(result)
          win.webContents.send("sendmessage", { type: null, data: result })

        })
      })
    })
    socket.on("upload", (file, callback) => {
      let obj = new Object();
      obj.filename = file.name
      obj.users = file.users

      db.insertTableContent("files", location, obj, (succ, msg) => {
        console.log(msg)
        writeFile(location + file.name, file.file, (err) => {
          callback({ message: err ? "failed to upload file" : "success" })
        });
        db.getAll("files", location, (succ, result) => {
          var res = []
          for (let i in result) {
            const users = result[i].users
            if (arg.users.includes(users[0]) || arg.users.includes(users[1])) {
              res.push(result[i])
            }
          }
          win.webContents.send("sendfile", { type: null, data: res })

        })

      })
    })
  });
  
  ipcMain.on("addConv", (event, arg) => {
    db.insertTableContent("conversation", location, arg, async (succ, msg) => {
      db.getAll("conversation", location, async (succ, result) => {
        var res = []
        for (let i in result) {
          const users = result[i].users
          if (arg.users.includes(users[0]) || arg.users.includes(users[1])) {
            res.push(result[i])
          }
        }
        event.returnValue = res
      })
    })
  })
  ipcMain.on("getchat", (event, arg) => {
    console.log(arg)
    db.getRows('messages', location, { conversation: arg.conversation }, (succ, result) => {
      console.log(result)
      event.returnValue = result
    })
  })
  ipcMain.on("addIp", async (event, arg) => {
    console.log(arg)

    db.insertTableContent("ips", location, arg, async (succ, msg) => {
      var res = [];
      db.getAll('ips', location, async (succ, result) => {
        for (let i in result) {
          if (result[i].users.includes(arg.users[0])) {
            res.push(result[i])
          }
        }
        event.returnValue = res
      })
    })
  })

  ipcMain.on("myIp", (event, arg) => {
    event.returnValue = localIpAddress()
  })

  ipcMain.on("getIp", (event, arg) => {
    console.log(arg)
    db.getAll("ips", location, async (succ, result) => {
      console.log(result)
      const user = arg.user;
      var res = []
      for (let i in result) {
        console.log(result[i])
        if (result[i].users.includes(user)) {
          res.push(result[i])
        }
      }
      console.log(res)

      event.returnValue = res
    })
  })
  ipcMain.on("getConv", (event, arg) => {
    db.getAll("conversation", location, async (succ, result) => {
      var res = []
      for (let i in result) {
        const users = result[i].users
        if (arg.users.includes(users[0]) || arg.users.includes(users[1])) {
          res.push(result[i])
        }
      }
      event.returnValue = res
    })
  })
  ipcMain.on("addMsg", (event, arg) => {
    db.insertTableContent("messages", location, arg, (succ, msg) => {
      db.getRows('messages', location, { conversation: arg.conversation }, (succ, result) => {
        //console.log(result)
        event.returnValue = result
      })
    })
  })

  ipcMain.on("signup", (event, arg) => {
    db.insertTableContent("users", location, arg, (succ, msg) => {
      console.log(msg)
      console.log(succ)
      console.log(arg["username"])
      event.returnValue = succ


    })
  })
  ipcMain.on("login", (event, arg) => {
    console.log(arg)
    db.getRows("users", location, arg, (succ, result) => {
      if (result.length != 0) {
        event.returnValue = result[0]
      } else {
        event.returnValue = false
      }
    })
  })

  ipcMain.on('browse', (event, arg) => {
    db.getAll("files", location, (succ, result) => {
      var res = []
      for (let i in result) {
        const users = result[i].users
        if (arg.users.includes(users[0]) || arg.users.includes(users[1])) {
          res.push(result[i])
          console.log("found")
        }
      }

      event.returnValue = res

    })
  })
  ipcMain.on('download', (event, arg) => {
    var name = arg.filename;
    fs.readFile(location + name, (error, data) => {
      event.returnValue = { file: data }
      console.log(data)
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
