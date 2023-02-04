import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import PostPicForm from './components/PostPicForm';
import PicGrid from './components/PicGrid';
import { VIEW_ALL, VIEW_ME, VIEW_POST } from './utils/constants';
import './App.scss';
const cookies = new Cookies();

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState(VIEW_ALL);
  const [userView, setUserView] = useState(-1);

  const handleLogout = () => {
    cookies.remove('gh_jwt');
    window.location.reload();
  };

  const handleView = (view) => {
    setView(view);
  }

  const handleUserView = (id) => {
    setUserView(id);
  }

  useEffect(() => {
    const gh_jwt = new URLSearchParams(window.location.search).get('gh_jwt');

    if (gh_jwt) {
      cookies.set('gh_jwt', gh_jwt);
      window.history.replaceState({}, document.title, '/');
    }

    if (cookies.get('gh_jwt')) {
      (async function () {
        try {
          const { data } =
            await axios
              .get(import.meta.env.VITE_SERVER_ORIGIN + '/auth/me', {
                withCredentials: true,
              });

          setUser(data);
          setUserView(data.id);
        } catch (error) {
          console.error(error);
          cookies.remove('gh_jwt');
        }
      })();
    }
  }, []);

  return (
    <div className="App">
      <div className="top_bar">
        <div className="top_left">
          <button
            onClick={() => handleView(VIEW_ALL)}
            className={view === VIEW_ALL ? 'selected' : ''}
          >
            All
          </button>
          {
            user &&
            <>
              <button
                onClick={() => { handleView(VIEW_ME); handleUserView(user.id); }}
                className={view === VIEW_ME ? 'selected' : ''}
              >
                My Pics
              </button>
              <button
                onClick={() => handleView(VIEW_POST)}
                className={view === VIEW_POST ? 'selected' : ''}
              >
                Post a Pic
              </button>
            </>
          }
        </div>
        <div className="top_right">
          {
            user
              ? <button
                onClick={handleLogout}
              >
                logout
              </button>
              : <a
                href={
                  'https://github.com/login/oauth/authorize'
                  + `?client_id=${import.meta.env.VITE_GH_CLIENT_ID}`
                  + `&redirect_uri=${import.meta.env.VITE_SERVER_ORIGIN + '/auth/github'}`
                  + '&path=/'
                  + '&scope=profile'
                }
              >
                <i className="fa-brands fa-github" /> Login
              </a>
          }
        </div>
      </div>
      <div className="main">
        {
          view === VIEW_POST
            ? <PostPicForm user={user} />
            : <PicGrid
              user={user}
              view={view}
              userView={userView}
              handleView={handleView}
              handleUserView={handleUserView}
            />
        }
      </div>
    </div>
  );
}

export default App;
