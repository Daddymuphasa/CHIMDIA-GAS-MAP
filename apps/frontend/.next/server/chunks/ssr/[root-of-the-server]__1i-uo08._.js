module.exports = [
  18622,
  (a, b, c) => {
    b.exports = a.x('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js', () =>
      require('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js')
    );
  },
  56704,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-async-storage.external.js')
    );
  },
  32319,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-unit-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-unit-async-storage.external.js')
    );
  },
  24725,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/after-task-async-storage.external.js', () =>
      require('next/dist/server/app-render/after-task-async-storage.external.js')
    );
  },
  20635,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/action-async-storage.external.js', () =>
      require('next/dist/server/app-render/action-async-storage.external.js')
    );
  },
  43285,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/dynamic-access-async-storage.external.js', () =>
      require('next/dist/server/app-render/dynamic-access-async-storage.external.js')
    );
  },
  42602,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(18622);
  },
  87924,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(42602).vendored['react-ssr'].ReactJsxRuntime;
  },
  72131,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(42602).vendored['react-ssr'].React;
  },
  35112,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(42602).vendored['react-ssr'].ReactDOM;
  },
  3637,
  (a) => {
    'use strict';
    var b = a.i(87924),
      c = a.i(72131);
    let d = (0, c.createContext)(void 0);
    a.s([
      'AuthProvider',
      0,
      ({ children: a }) => {
        let [e, f] = (0, c.useState)(null),
          [g, h] = (0, c.useState)(!1),
          [i, j] = (0, c.useState)(!0),
          [k, l] = (0, c.useState)(null);
        return (
          (0, c.useEffect)(() => {}, []),
          (0, b.jsx)(d.Provider, {
            value: {
              isAuthenticated: g,
              isLoading: i,
              user: k,
              login: () => {
                e && e.login();
              },
              logout: () => {
                e && e.logout({ redirectUri: window.location.origin });
              },
            },
            children: a,
          })
        );
      },
      'useAuth',
      0,
      () => {
        let a = (0, c.useContext)(d);
        if (void 0 === a) throw Error('useAuth must be used within an AuthProvider');
        return a;
      },
    ]);
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1i-uo08._.js.map
