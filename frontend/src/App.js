import logo from './logo.svg';
import './App.css';
import { useEffect, useRef } from 'react';
import {io} from 'socket.io-client';
import { setsocket } from './redux/slices/socket';
import {useSelector,useDispatch} from 'react-redux';

function App() {
  let dispatch = useDispatch();
  let socketref=useRef()
  let socket=useSelector((state)=>state.socket.id);
  useEffect(() => {
    socketref.current=io("http://localhost:3001")
    socketref.current.on('connect', () => {
      dispatch(setsocket({ id: socketref.current.id })); 
      console.log('Connected with ID:', socketref.current.id);
    }); 
    return () => {
       socketref.current.disconnect();
    }
  }, []);
  useEffect(() => {
    console.log(socket);
  },[socket])

  return (
    <>
  
    </>
  );
}

export default App;
