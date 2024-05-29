import './App.css';
import {useRef, useState, useEffect} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const backEndUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : 'http://localhost:3001';

function ChatMessage({ value }) {
  return (
      <div className={value.from === 'user' ? 'chat-message-container-user' : 'chat-message-container'}>
        {value.image && (
            <img style={{ maxWidth: '100%', maxHeight: '52px' }} src={value.image}  alt="user uploaded"/>
        )}
        <ReactMarkdown className={value.from === 'user' ? 'chat-message-user' : 'chat-message'} remarkPlugins={[remarkGfm]}>
          {value.message}
        </ReactMarkdown>
      </div>
  );
}

export default function MainContainer() {
  const [messages, setMessages] = useState(starterMessage);
  const [userInput, setUserInput] = useState('');
  const [userImage, setUserImage] = useState(null);
  const messageContainerRef = useRef(null);

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

      const formData = new FormData();
      let newMessages = [...messages, {from: 'user', image: userImage, message: userInput}]
      formData.append('messages', JSON.stringify(newMessages));
      newMessages = [...newMessages, {from: 'app', image: null, message: '. . . '}];

      await setMessages(messages => newMessages);


      // TODO add error message and update url
      await axios.post(backEndUrl + '/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        newMessages[newMessages.length - 1] = {from: response.data.from, image: response.data.image, message: response.data.message};
        setMessages(messages => newMessages);
      }).catch(error => {
        newMessages[newMessages.length - 1] = {from: 'app', image: null, message: 'Error retrieving response. Please try again.'};
        setMessages(messages => newMessages);
      });

      // Clear the input field
      setUserInput('');
      setUserImage(null);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <>
        <div className="main-container">
          <div className="chat-messages" ref={messageContainerRef}>
            {messages.map((msg, index) => (
                <ChatMessage key={index} value={msg} />
            ))}
          </div>
          <div className="user-input">
            <input type="file" onChange={handleFileChange} />
            {userImage && (
                <div>
                  <img src={userImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '52px' }} />
                </div>
            )}
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message Flower Plant Recognizer"
                alt="upload image or prompt"
                className="user-input-field"/>
            <button className="send-user-input-button" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </>
  )
}

const starterMessage = [{from: 'app', image: null, message: 'Upload an image of your plant or describe it and I will help you identify its name.'}];



