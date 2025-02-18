import Nav from "../components/Nav"
import { io } from "socket.io-client";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { GiHummingbird } from "react-icons/gi";
import { Toaster, toast } from 'alert';
import FileSaver from "file-saver";

export default function Send() {
    const navigate = useNavigate()
    const [files, setFiles] = useState([])
    const [checker, setChecker] = useState(true)
    const [browse, setBrowse] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null) {
            navigate("/login")
        }
        if (checker==true) {
            const res = window.electron.ipcRenderer.sendSync("browse", {users: [localStorage.getItem("user"), localStorage.getItem("ipUser")]})
            console.log(res)

            setFiles(res)
            setChecker(false)
        }
        window.electronAPI.onFileEvent((event,data) => {
            toast.success(`File received`)
            setFiles(data)
            setChecker(true)

        })
    },[checker])
    const [ip, setIp] = useState(localStorage.getItem("ip"))


    const handleIp = (e) => {
        setIp(e.target.value)
    }
    const submit = (e) => {
        toast.success('We are sending your file.')

        console.log(e.target.files)
        const socket = io("http://" + ip + ":3000");

        socket.emit("upload", { file: e.target.files[0], name: e.target.files[0].name, users: [localStorage.getItem("user"), localStorage.getItem("ipUser")] }, (status) => {
            toast.success('File sent')
            setChecker(true)

        });

    }
    const download = (name) => {
        const res = window.electron.ipcRenderer.sendSync("download", { filename: name })

        var file = new Blob([res.file])
        FileSaver.saveAs(file, name)
    }
    return (
        <>
            <div className="container">
                <Nav />
                <Toaster position='top-center' />

                <div className="container">
                    <center>
                        <br />
                        <h2>Start sending files to other devices now <GiHummingbird /></h2>
                        <p>The Sender and the Receiver must be connected to the same network</p>
                    </center>


                    {browse == true ?

                        <div className="container second-color">
                            <br/>
                            <div className="scroll2">
                                <div className="box">
                                    <div className="one">
                                    <h4>Browse file</h4>
                                    </div>
                                    <div className="one">
                                        <button className="button button-black float-right" onClick={()=>{setBrowse(false)}}>Send File</button>
                                    </div>
                                </div>
                                

                                {files.map(item => {
                                    return (
                                        <>
                                            <br />
                                            <div className="container first-color">
                                                <br />

                                                <div className="row ">
                                                    <div className="column">
                                                        <p>{item.filename}</p>
                                                    </div>
                                                    <div className="column">
                                                        <button className="button button-light float-right" onClick={() => { download(item.filename) }}>Download</button>
                                                    </div>

                                                </div>

                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        :
                                  <div className="container second-color">
                                    <br/>
                                     <div className="box">
                                    <div className="one">
                                    <h4>IP address of the reciever</h4>                                    
                                    </div>
                                    <div className="one">
                                        <button className="button button-black float-right" onClick={()=>{setBrowse(true); setChecker(true)}}>Browse</button>
                                    </div>
                                </div>
                               
                                <div className="row">
                                    <div className="column">
                                        <input placeholder="Ip address e.g. 123.123.22.1" onChange={handleIp} value={localStorage.getItem("ip")} />

                                    </div>
                                </div>
                                <br />
                                <div className="container second-color">
                                   
                                    <p> We use port forwarding and sockets to send your file over a secure channel</p>
                                    <center>
                                        <input type="file" onChange={submit} />
                                    </center>
                                </div>
                                <br />
                                <br />
                            </div>
                         
                    }


                </div>
                </div>
            </>
            )
}