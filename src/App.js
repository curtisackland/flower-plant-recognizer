import './App.css';
import {useRef, useState, useEffect} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NavBar from "./components/NavBar/NavBar";
import {mdiSend, mdiUpload} from "@mdi/js";
import Icon from "@mdi/react";

const backEndUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : 'http://localhost:3001';

function ChatMessage({ value }) {
  return (
      <div className={value.from === 'user' ? 'chat-message-container-user' : 'chat-message-container'}>
        <div className={value.from === 'user' ? 'chat-message-user' : 'chat-message'}>
          {value.image && (
              <div style={{width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                <img style={{ maxWidth: '100%', maxHeight: '100px' }} src={value.image}  alt="user uploaded"/>
              </div>
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value.message}
          </ReactMarkdown>
        </div>
      </div>
  );
}

export default function MainContainer() {
  const [messages, setMessages] = useState(starterMessage);
  const [userInput, setUserInput] = useState('');
  const [userImage, setUserImage] = useState(null);
  const messageContainerRef = useRef(null);
  const [disableInput, setDisableInput] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // handle images
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setUserImage(null);
    setImageKey(prevKey => prevKey + 1);
  }

  // Handle input change
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }

  // Handle key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Add the input value to the array
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() || userImage) {
      setDisableInput(true);

      const formData = new FormData();
      let newMessages = [...messages, {from: 'user', image: userImage, message: userInput}]
      formData.append('messages', JSON.stringify(newMessages));
      newMessages = [...newMessages, {from: 'app', image: null, message: '. . . '}];

      // Clear the input field
      setUserInput('');
      handleDeleteImage();

      await setMessages(newMessages);

      await axios.post(backEndUrl + '/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            from: response.data.from,
            image: response.data.image,
            message: response.data.message
          };
          return updatedMessages;
        });
      }).catch(error => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            from: 'app',
            image: null,
            message: 'Error retrieving response. Please try again or refresh the page.'
          };
          return updatedMessages;
        });
      });

      setDisableInput(false);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <>
        <div className="page-container">
          <NavBar></NavBar>
          <div className="main-container">
            <div className="chat-messages" ref={messageContainerRef}>
              {messages.map((msg, index) => (
                  <ChatMessage key={index} value={msg}/>
              ))}
            </div>
            {userImage && (
                <div className="user-image-container">
                  <img src={userImage} alt="Uploaded" style={{maxWidth: '100%', maxHeight: '100px'}}/>
                  <button className="delete-button" onClick={handleDeleteImage}></button>
                </div>
            )}
            <div className="user-input">
            <div className="file-input-wrapper">
                <input type="file" key={imageKey} id="fileInput" className="file-input" onChange={handleFileChange} disabled={disableInput} />
                <label htmlFor="fileInput" className={`file-input-label ${disableInput ? 'disabled' : ''}`}>
                  <Icon path={mdiUpload} size={1}></Icon>
                </label>
              </div>
              <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={disableInput}
                  placeholder="Message Flower Plant Recognizer"
                  alt="upload image or prompt"
                  className="user-input-field"/>
              <button className="send-user-input-button" disabled={disableInput} onClick={handleSendMessage}>
                <Icon path={mdiSend} size={1}></Icon>
              </button>
            </div>
          </div>
        </div>
      </>
  )
}

const starterMessage = [{
  from: 'app',
  image: null,
  message: 'Welcome to **Flower Plant Recognizer**!  ' +
      '\n\n Upload an image or describe a flower and I will help you identify it!  ' +
      '\n\n I can also provide you with insightful information about flowers and plants like its scientific name, origin, growing conditions, care tips, and interesting facts!'
}];



