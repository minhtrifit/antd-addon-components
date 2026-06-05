import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AntDesignProvider from './+core/provider/AntDesignProvider';
import { router } from './routes/router';
import './i18n';
import './styles/globals.scss';

function App() {
  return (
    <Provider store={store}>
      <AntDesignProvider>
        <RouterProvider router={router} />
      </AntDesignProvider>
    </Provider>
  );
}

export default App;
