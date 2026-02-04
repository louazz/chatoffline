import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { useNavigate } from "react-router"
import Nav from "../components/Nav"
import { GiHummingbird } from "react-icons/gi";
import { Toaster, toast } from 'alert';
import { v4 as uuidv4 } from 'uuid';

export default function Chat() {
    const [checker, setChecker] = useState(true)
    const [key, setKey] = useState(Math.random())
    const [msg, setMsg] = useState([])
    const [input, setInput] = useState("")
    const [convId, setCoonvId] = useState(null)
    const [conversation, setConversation] = useState([{}])
    const [create, setCreate] = useState(false)

    const navigate = useNavigate()
    const socket = io(`http://${localStorage.getItem("ip")}:3000`);

    useEffect(() => {
        //alert(JSON.stringify(conversation))
        if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null) {
            navigate("/login")
        }

        if (convId != null) {

            if (checker == true) {
                const res = window.electron.ipcRenderer.sendSync("getchat", { conversation: convId })
                setMsg(res)
                //alert("The conversation id is:"+ convId)
                setChecker(false)
                setInput('Type Something ...')
            }

            window.electronAPI.onBroadCastedEvent((event, data) => {
                toast.success(`Recieved a message`)

                console.log(data)
                // alert(JSON.stringify(data))
                setMsg(data)
                setKey(Math.random())
                console.log(msg == data)
            })
        } else {
            if (checker) {
                const myip = window.electron.ipcRenderer.sendSync("myIp")

                const res = window.electron.ipcRenderer.sendSync("getConv", { users: [localStorage.getItem("user"), localStorage.getItem("ipUser")], ip: [localStorage.getItem('ip'), myip] })
                setConversation(res)
                console.log(res)
                var tmp = []
                for (var i in res) {
                    console.log(res[i].ip)
                    var new_conv = res[i]
                    if (res[i].ip[0] == localStorage.getItem('ip')) {
                        new_conv.ip = res[i].ip[0]
                    } else {
                        new_conv.ip = res[i].ip[1]
                    }

                    tmp.push(new_conv)
                }
                setConversation(tmp)
                setChecker(false)

            }
            window.electronAPI.onConvEvent((event, data) => {
                toast.success(`Conversation added`)
                console.log(data)

                var tmp = []
                for (var i in data) {
                    console.log(data[i].ip)
                    var new_conv = res[i]
                    if (data[i].ip[0] == localStorage.getItem('ip')) {
                        new_conv.ip = data[i].ip[0]
                    } else {
                        new_conv.ip = data[i].ip[1]
                    }

                    tmp.push(new_conv)
                }
                setConversation(tmp)

                setKey(Math.random())
            })
        }
    }, [convId])

    const addConv = async () => {
        const id = uuidv4()
        const myip = window.electron.ipcRenderer.sendSync("myIp")

        const data = { ip: [localStorage.getItem("ip"), myip], users: [localStorage.getItem("user"), localStorage.getItem("ipUser")], sharedId: id };
        const conv = window.electron.ipcRenderer.sendSync("addConv", data)

        console.log(conv)
        var tmp = []
        for (var i in conv) {

            var new_conv = conv[i]
            if (conv[i].ip[0] == localStorage.getItem('ip')) {
                new_conv.ip = conv[i].ip[0]
            } else {
                new_conv.ip = conv[i].ip[1]
            }

            tmp.push(new_conv)
        }
        setConversation(tmp)


        setChecker(true)

        await socket.emitWithAck("conversation", data);
        toast.success('Conversation added ...')
    }
    const onSend = () => {
        const m = window.electron.ipcRenderer.sendSync("addMsg", { message: input, user: [localStorage.getItem("user"), localStorage.getItem("ipUser")], conversation: convId, date: new Date().toLocaleString() })
        setMsg(m)
        setKey(Math.random())
        setInput("")
        socket.emit("message", { message: input, user: [localStorage.getItem("user"), localStorage.getItem("ipUser")], conversation: convId, date: new Date().toLocaleString() });
    }
    const onChat = (id) => {
        setCoonvId(id)
        setKey(Math.random())
        setChecker(true);

    }
    const handleChange = (e) => {
        setInput(e.target.value)
    }

    return (
        <>
            <div className="container">
                <Nav />
                <Toaster position='top-center' />
                <br />
                <br />
                <div className="container">

                    {convId == null && create == false ?
                        <>
                            <center>
                                <h2>Start chatting now <GiHummingbird /></h2>
                                <p>The Sender and the Receiver must be connected to the same network</p>
                            </center>
                            <div className="box">
                                <div className="one">
                                    <h4>Browse Conversations</h4>

                                </div>
                               
                            </div>


                            <div className="container ">
                                <div>
                                    
                                <div className="container">
                                  

                                    <div className="box">
                                        <div className="one">
                                            <input className='form-control' placeholder="Enter IP address of the other device" defaultValue={localStorage.getItem("ip")} />
                                        </div>
                                        <div className="one">
                                            <button className="btn btn-info float-right" onClick={addConv} >Create</button>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="scroll">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Identity</th>
                                                    <th scope="col">Ip</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            {conversation.map(item => {
                                                return (

                                                    <tbody>
                                                        <tr class="table-info">
                                                            <th scope="row">{item.sharedId}</th>
                                                            <th scope="row">{item.ip}</th>
                                                            <td>  {item.ip?.includes(localStorage.getItem("ip")) ? <button className="btn btn-danger float-right" onClick={() => { onChat(item.sharedId) }}>
                                                                Chat
                                                            </button> : <button className="btn btn-dark float-right" onClick={() => { onChat(item.sharedId) }} disabled>
                                                                Chat
                                                            </button>}</td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            })}




                                        </table>
                                    </div>
                                </div>
                          
                                </div> </div>
                        </>
                        : convId !== null ?
                          
                            <>

                                <div className="row">
                                    <div className="column">
                                        <button className="btn btn-dark" onClick={() => { setCoonvId(null) }}>Exit Conversation</button>
                                    </div>
                                </div>
                                <div className="container ">
                                    <br />
                                    <div >
                                        <div>
                                            <div>

                                                <div className="container scroll">


                                                    {msg.map((item, i) => {
                                                        return (
                                                            item.user[0] == localStorage.getItem("user") ?
                                                                <>
                                                                    <div className="row">
                                                                        <div className="column column-50 fourth-color" key={i}>

                                                                            <p className="float-left">{item.message} <br />
                                                                                <small className="float-left">{item.date}</small></p>
                                                                        </div></div>
                                                                    <br />
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="row">
                                                                        <div className="column column-50  third-color column-offset-50" key={i}>

                                                                            <p className="float-left">{item.message} <br />
                                                                                <small className="float-left">{item.date}</small></p>

                                                                        </div></div>
                                                                    <br />
                                                                </>

                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <br />    <br />
                                    <center id='footer'>
                                        <div className="box">
                                            <div className="one">
                                                <textarea className="form-control" placeholder="type something" defaultValue={input} onChange={handleChange} />
                                            </div>
                                            <div className="one">
                                                <button className="btn btn-info float-left" onClick={onSend} >Send</button>
                                            </div>

                                        </div>

                                        <br />
                                    </center>
                                </div>

                            </>: <></>
                    }
                </div>
            </div>

        </>
    )


}