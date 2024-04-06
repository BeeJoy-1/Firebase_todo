import { useEffect, useState } from "react"
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import firebaseConfig from "./Config/FirebaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  let [name,setName] = useState("")
  let [todo,setTodo] = useState("")
  let [alltodo,setAlltodo] = useState([])
  let [show,setShow] = useState(true)
  let [info,setInfo] = useState()
  
  const db = getDatabase();

    // Read Operation
  useEffect(() => {
    const TodoRef = ref(db, 'Todo/');
    onValue(TodoRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) =>{
        arr.push({...item.val(), id: item.key})
      })
      setAlltodo(arr)
  });
  },[])

  let handleSubmit = () => {

    // Write Operation
    set(push(ref(db, 'Todo')), {
      User: name, 
      Todo: todo,
    }).then(() => {
      toast.success('Todo created Sucessfully..!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    });

    setName("")
    setTodo("")

  }

  let handleEdit = (edited) => {
    setName(edited.User)
    setTodo(edited.Todo)
    setShow(false)
    setInfo(edited)
  }

  let handleUpdate = () => {
    update(ref(db, "Todo/" + info.id),{
      User : name,
      Todo : todo
    }).then(() => {
      toast.success('Todo Updated Sucessfully..!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    });
    setShow(true)
    setName("")
    setTodo("")
  }

  let handleDelete = (deleteid) => {
    remove(ref(db, "Todo/" + deleteid)).then(() => {
      toast.error('Todo deleted Sucessfully..!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    })
  }

  return (
    <>
      <ToastContainer/>

      <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" /> <br />
      <input onChange={(e) => setTodo(e.target.value)} value={todo} type="text" placeholder="Todo" /> <br />
      {
        show 
        ?
        <button onClick={handleSubmit}>Submit</button>
        :
        <button onClick={handleUpdate}>Update</button>
      }

      {
        alltodo.map((item) => (
          <>
            <li>{item.User}</li>
            <li>{item.Todo}</li>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </>
        ))
      }
    </>
  )
}

export default App
