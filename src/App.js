import './App.css';
import {useRef, useState, useEffect} from 'react';
import axios from 'axios';

function ChatMessage({ value }) {
  return (
      <div className={value.from === 'user' ? 'chat-message-container-user' : 'chat-message-container'}>
        {value.image && (
            <img style={{ maxWidth: '100%', maxHeight: '52px' }} src={value.image}  alt="user uploaded"/>
        )}
        <div className={value.from === 'user' ? 'chat-message-user' : 'chat-message'}>
          {value.text}
        </div>
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
    setUserImage(event.target.files[0]);

    /**
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
        */
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
    if (userInput.trim()) {

      const formData = new FormData();
      if (userImage)
        formData.append('image', userImage);

      if (userInput.trim())
        formData.append('message', userInput);

      // TODO add error message and update url
      try {
        await axios.post('http://localhost:3001/send-message', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          setMessages([...messages, {from: 'user', image: userImage, text: userInput}, {from: response.data.from, image: response.data.image, text: response.data.message}]);
        }).catch(error => {console.log(error)});
      } catch (error) {
        console.error('Error uploading file:', error);
      }


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

const starterMessage = [{from: 'app', image: null, text: 'Upload an image of your plant or describe it and I will help you identify its name.'}];



