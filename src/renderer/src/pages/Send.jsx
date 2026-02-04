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
    const [key, setKey] = useState(Math.random())


    useEffect(() => {
        if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null) {
            navigate("/login")
        }
        if (checker == true) {
            const res = window.electron.ipcRenderer.sendSync("browse", { users: [localStorage.getItem("user"), localStorage.getItem("ipUser")] })
            console.log(res)

            setFiles(res)
            setChecker(false)
        }
        window.electronAPI.onFileEvent((event, data) => {
            toast.success(`File received`)
            setFiles(data)
            setKey(Math.random())
            setChecker(true)

        })
    }, [checker])
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
                <br />
                <br />
                <div className="container">
                    <center>
                        <br />
                        <h2>Start sending files to other devices now <GiHummingbird /></h2>
                        <p>The Sender and the Receiver must be connected to the same network</p>
                    </center>


                    {browse == true ?

                        <div className="container ">
                            <br />
                            <div >
                                <div className="box">
                                    <div className="one">
                                        <h4>Browse file</h4>
                                    </div>
                                    <div className="one">
                                        <button className="btn btn-dark float-right" onClick={() => { setBrowse(false) }}>Send File</button>
                                    </div>
                                </div>
                                <br/>
                                <div className="scroll2">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">File name</th>
                                            <th scope="col">Action</th>

                                        </tr>
                                    </thead>
                                    {files.map(item => {
                                        return (
                                            <>



                                                <tbody>
                                                    <tr class="table-info">
                                                        <th scope="row">{item.filename}</th>
                                                        <td><button className="btn btn-dark float-right" onClick={() => { download(item.filename) }}>Download</button></td>

                                                    </tr>
                                                </tbody>


                                            </>
                                        )
                                    })}
                                </table>
                            </div>
                        </div></div>
                        :
                        <div className="container ">
                            <br />

                            <button className="btn btn-dark float-right" onClick={() => { setBrowse(true); setChecker(true) }}>Browse</button>

                            <br />

                            <label className="form-label mt-4">IP address of the reciever</label>
                            <input className="form-control" placeholder="Ip address e.g. 123.123.22.1" onChange={handleIp} value={localStorage.getItem("ip")} />



                            <div className="container">


                                <label className="form-label mt-4">Select a file to send</label>
                                <input className='form-control' type="file" onChange={submit} />

                            </div>
                            <br />
                            <br />
                        </div>

                    }


                </div>
            </div>
            <br />
            <br />
            <div className="fifth-color" id='footer' >This app is made by Louai Zaiter in 2025.</div>
        </>
    )
}
