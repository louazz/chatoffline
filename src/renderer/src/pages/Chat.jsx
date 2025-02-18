import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { useNavigate } from "react-router"
import Nav from "../components/Nav"
import { GiHummingbird } from "react-icons/gi";
import { Toaster, toast } from 'alert';
import { v4 as uuidv4 } from 'uuid';

export default function Chat (){
    const [checker, setChecker]= useState(true)
    const [key, setKey]= useState(Math.random())
    const [msg, setMsg] = useState([])
    const [input, setInput]= useState("")
    const [convId, setCoonvId]= useState(null)
    const [conversation, setConversation] =useState([{}])
    const [create, setCreate] = useState(false)
    
    const navigate = useNavigate()

    const socket = io(`http://${localStorage.getItem("ip")}:3000`);
    useEffect(()=>{
        if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null) {
            navigate("/login")
        }
     
        if(convId != null){
        
            if (checker==true){
                const res =  window.electron.ipcRenderer.sendSync("getchat",{conversation: convId})           
                setMsg(res)
                //alert("The conversation id is:"+ convId)
                setChecker(false)
                setInput('Type Something ...')
            }
           
            window.electronAPI.onBroadCastedEvent((event,data) => {
                toast.success(`Recieved a message`)

               console.log(data)
                // alert(JSON.stringify(data))
                setMsg(data)
                setKey(Math.random())
                console.log(msg == data)
            })
        }else{
            if(checker){
                const myip =  window.electron.ipcRenderer.sendSync("myIp")  

                //alert(typeof localStorage.getItem("user"))
  
                const res =  window.electron.ipcRenderer.sendSync("getConv", { users: [localStorage.getItem("user"), localStorage.getItem("ipUser")], ip:  [localStorage.getItem('ip'),myip]})           
            setConversation(res)
            setChecker(false)

}
window.electronAPI.onConvEvent((event,data) => {
    toast.success(`Conversation added`)
    console.log(data)

    setConversation(data)
    setKey(Math.random())
})
}},[convId])
      
    const addConv = async()=>{
        const id = uuidv4()
        const myip =  window.electron.ipcRenderer.sendSync("myIp")  

        const data = {ip: [localStorage.getItem("ip"), myip], users: [localStorage.getItem("user"), localStorage.getItem("ipUser")], sharedId: id};
        const conv =  window.electron.ipcRenderer.sendSync("addConv", data)  
        setConversation(conv)
        setChecker(true)

        await socket.emitWithAck("conversation", data);
        toast.success('Conversation added ...')
    }
    const onSend= ()=>{
            const m =  window.electron.ipcRenderer.sendSync("addMsg", {message: input, user: [localStorage.getItem("user"), localStorage.getItem("ipUser")], conversation: convId, date: new Date().toLocaleString()})  
            setMsg(m)
            setKey(Math.random())
            setInput("")
         socket.emit("message", {message: input, user: [localStorage.getItem("user"), localStorage.getItem("ipUser")], conversation: convId, date: new Date().toLocaleString()});
    }
    const onChat =(id)=>{
        setCoonvId(id)
        setKey(Math.random())
        setChecker(true);

    }
    const handleChange= (e)=>{
        setInput(e.target.value)
    }

    return (

        <div className="container">
        <Nav/>
        <Toaster position='top-center'/>

        <div className="container">
            
       {convId==null && create==false?
       <>
       <center>
                        <h2>Start chatting now <GiHummingbird/></h2>
                        <p>The Sender and the Receiver must be connected to the same network</p>
            </center>
       <div className="row">
        <div className="column">
        <h4>Browse Conversations</h4>

        </div>
        <div className="column">
        <button className="button button-black float-right" onClick={()=>{setCreate(true); setChecker(true)}}>Create Conversation</button>

        </div>
       </div>
      


     <br/>
     <div className="container second-color">
     <div className="scroll" key= {key}>
             {
             conversation.length == 0?
             <>
        
             
             <div className="container second-color">
                <p>There are no conversations stored in the database ...</p>
                </div></>
                :
                <>
                 
                {
             conversation.map(item=>{return (
       
                <>
                <br/>
                <div className="container first-color">
                <br/>
   <div className="row">
       <div className="column">
           {item.sharedId}
       </div>
       <div className="column">
           {item.ip}
       </div>
       <div className="column">
       {item.ip?.includes(localStorage.getItem("ip")) && item.id !== undefined? <button className="button button-light float-right"  onClick={()=>{onChat(item.sharedId)}}>
           Chat
       </button> : <button className="button button-light float-right"  onClick={()=>{onChat(item.id)}} disabled>
           Chat
       </button> }
       </div>
       
   </div></div>
   
   </>
               
          
        )})}</>}
          </div> </div>
     </>
       : convId==null && create ==true?
<>
<center>
                        <h2>Start chatting now <GiHummingbird/></h2>
                        <p>The Sender and the Receiver must be connected to the same network</p>
            </center>
<div className="container second-color">
    <br/>
    <div className="box">
        <div className="one">
        <h4>Create a conversation</h4>
        </div>
        <div className="one">
 <button className="button button-light float-right" onClick={()=>{setCreate(false)}}>Browse Conversations</button>
        </div>
    </div>

<br/>
<div className="row">
    <div className="column column-75">
      <input placeholder="Enter IP address of the other device" defaultValue={localStorage.getItem("ip")} />
    </div>
    <div className="column">
<button className="button button-black float-right" onClick={addConv} >Create</button>
    </div>
</div>
<div className="scroll2" key= {key}>
    {conversation.map(item =>{return(
            <>
            <br/>
            <div className="container first-color">
            <br/>
<div className="row">
   <div className="column">
       {item.sharedId}
   </div>
   <div className="column">
       {item.ip}
   </div>
   <div className="column">
    {item.ip?.includes(localStorage.getItem("ip"))? <button className="button button-light float-right"  onClick={()=>{onChat(item.sharedId)}}>
           Chat
       </button> : <button className="button button-light float-right"  onClick={()=>{onChat(item.sharedId)}} disabled>
           Chat
       </button> }
      
   </div>
   
</div></div>

</>

)})}
</div>
</div>
</>
       :
       <>
       <br/>
       <div className="row">
        <div className="column">
        <button className="button button-black" onClick={()=>{setCoonvId(null)}}>Exit Conversation</button>
        </div>
       </div>
        <div className="container second-color">
            <br/>
            <div className="scroll" key ={key}>
                <div>
                    <div>
                       
                    <div className="container">

                      
                    {msg.map((item, i) =>{return(
                  item.user[0] == localStorage.getItem("user")?
                  <> 
                   <div className="row">
                  <div className="column column-50 first-color" key={i}>
                 
                    <p  className="float-left">{item.message} <br/>
                    <small className="float-left">{item.date}</small></p>
                    </div></div>
                    <br/>
                  </>
                :
                <>
                 <div className="row">
                <div className="column column-50  third-color column-offset-50"key={i}>
                 
                    <p  className="float-left">{item.message} <br/>
                    <small className="float-left">{item.date}</small></p>
                    
                    </div></div>
                    <br/>
                    </>
                
            )})} 
                    </div>
                    </div>
                </div>
            </div>
           <br/>
            <div className="row">
                <div className="column column-80">
<input placeholder="type something" defaultValue={input} onChange={handleChange} />
                </div>
                <div className="column">
<button className="button button-black float-left" onClick={onSend} >Send</button>
                </div>
            </div>
        </div>
      </>
    }
    </div>
    </div>
    )
}