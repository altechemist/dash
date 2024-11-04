import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx'
import { store } from './store/store.ts'
import { Provider } from 'react-redux'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')!
)
