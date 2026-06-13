module.exports = [
  89578,
  (a) => {
    a.v({
      className: 'geist_a71539c9-module__T19VSG__className',
      variable: 'geist_a71539c9-module__T19VSG__variable',
    });
  },
  35214,
  (a) => {
    a.v({
      className: 'geist_mono_8d43a2aa-module__8Li5zG__className',
      variable: 'geist_mono_8d43a2aa-module__8Li5zG__variable',
    });
  },
  38147,
  (a) => {
    'use strict';
    a.s(['AuthProvider', () => c, 'useAuth', () => d]);
    var b = a.i(11857);
    let c = (0, b.registerClientReference)(
        function () {
          throw Error(
            "Attempted to call AuthProvider() from the server but AuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        '[project]/apps/frontend/src/context/AuthContext.tsx <module evaluation>',
        'AuthProvider'
      ),
      d = (0, b.registerClientReference)(
        function () {
          throw Error(
            "Attempted to call useAuth() from the server but useAuth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        '[project]/apps/frontend/src/context/AuthContext.tsx <module evaluation>',
        'useAuth'
      );
  },
  31083,
  (a) => {
    'use strict';
    a.s(['AuthProvider', () => c, 'useAuth', () => d]);
    var b = a.i(11857);
    let c = (0, b.registerClientReference)(
        function () {
          throw Error(
            "Attempted to call AuthProvider() from the server but AuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        '[project]/apps/frontend/src/context/AuthContext.tsx',
        'AuthProvider'
      ),
      d = (0, b.registerClientReference)(
        function () {
          throw Error(
            "Attempted to call useAuth() from the server but useAuth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        '[project]/apps/frontend/src/context/AuthContext.tsx',
        'useAuth'
      );
  },
  3345,
  (a) => {
    'use strict';
    a.i(38147);
    var b = a.i(31083);
    a.n(b);
  },
  38279,
  (a) => {
    'use strict';
    var b = a.i(7997),
      c = a.i(89578);
    let d = {
      className: c.default.className,
      style: { fontFamily: "'Geist', 'Geist Fallback'", fontStyle: 'normal' },
    };
    null != c.default.variable && (d.variable = c.default.variable);
    var e = a.i(35214);
    let f = {
      className: e.default.className,
      style: { fontFamily: "'Geist Mono', 'Geist Mono Fallback'", fontStyle: 'normal' },
    };
    null != e.default.variable && (f.variable = e.default.variable);
    var g = a.i(3345);
    a.s(
      [
        'default',
        0,
        function ({ children: a }) {
          return (0, b.jsx)('html', {
            lang: 'en',
            className: `${d.variable} ${f.variable} h-full antialiased`,
            children: (0, b.jsx)('body', {
              className: 'min-h-full flex flex-col',
              children: (0, b.jsx)(g.AuthProvider, { children: a }),
            }),
          });
        },
        'metadata',
        0,
        {
          title: 'GasGrid Platform - NGML',
          description: 'Enterprise Gas Distribution Management Platform',
        },
      ],
      38279
    );
  },
  69086,
  (a) => {
    a.n(a.i(38279));
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nujkh5._.js.map
