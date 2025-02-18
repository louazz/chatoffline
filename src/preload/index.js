import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      onBroadCastedEvent: (callback) => {

          ipcRenderer.on("sendmessage", (event, {type, data}) => callback(type, data))
      },
     onConvEvent: (callback) =>{
      ipcRenderer.on("sendconversation", (event, {type, data}) => callback(type, data))

     },
     onIpEvent: (callback) =>{
      ipcRenderer.on("getUserIp", (event, {type, data}) => callback(type, data))

     },
     onFileEvent: (callback) =>{
      ipcRenderer.on("sendFile", (event, {type, data}) => callback(type, data))

     }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electronAPI = electronAPI
  window.electron = electronAPI
  window.api = api
}
