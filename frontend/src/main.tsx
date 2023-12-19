import React from 'react'
import ReactDOM from 'react-dom/client'
import  { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

import { GoogleOAuthProvider } from '@react-oauth/google';

const rootDOM = document.getElementById('root');

if(rootDOM){
    ReactDOM.createRoot(rootDOM).render(
      <GoogleOAuthProvider clientId='237780344404-saf9onq9o8sed419jsgp56h5ou691tlj.apps.googleusercontent.com'>
        <React.StrictMode>
          <BrowserRouter>
            <Provider store={store}>
              <App />
            </Provider>
          </BrowserRouter>
        </React.StrictMode>
      </GoogleOAuthProvider>
    )
}else{
  console.error('Root element with id "root" not found');
}
