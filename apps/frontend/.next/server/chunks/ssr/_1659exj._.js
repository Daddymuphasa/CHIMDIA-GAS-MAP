module.exports = [
  41997,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 });
    var d = {
      BailoutToCSRError: function () {
        return g;
      },
      isBailoutToCSRError: function () {
        return h;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
    class g extends Error {
      constructor(a) {
        super(`Bail out to client-side rendering: ${a}`), (this.reason = a), (this.digest = f);
      }
    }
    function h(a) {
      return 'object' == typeof a && null !== a && 'digest' in a && a.digest === f;
    }
  },
  32245,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'BailoutToCSR', {
        enumerable: !0,
        get: function () {
          return e;
        },
      });
    let d = a.r(41997);
    function e({ reason: a, children: b }) {
      throw Object.defineProperty(new d.BailoutToCSRError(a), '__NEXT_ERROR_CODE', {
        value: 'E394',
        enumerable: !1,
        configurable: !0,
      });
    }
  },
  7773,
  (a, b, c) => {
    'use strict';
    function d(a) {
      return a
        .split('/')
        .map((a) => encodeURIComponent(a))
        .join('/');
    }
    Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'encodeURIPath', {
        enumerable: !0,
        get: function () {
          return d;
        },
      });
  },
  68063,
  (a, b, c) => {
    'use strict';
    let d;
    Object.defineProperty(c, '__esModule', { value: !0 });
    var e = {
      getAssetToken: function () {
        return i;
      },
      getAssetTokenQuery: function () {
        return j;
      },
      getDeploymentId: function () {
        return g;
      },
      getDeploymentIdQuery: function () {
        return h;
      },
    };
    for (var f in e) Object.defineProperty(c, f, { enumerable: !0, get: e[f] });
    function g() {
      return d;
    }
    function h(a = !1) {
      return d ? `${a ? '&' : '?'}dpl=${d}` : '';
    }
    function i() {
      return !1;
    }
    function j(a = !1) {
      return '';
    }
    d = void 0;
  },
  97458,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'PreloadChunks', {
        enumerable: !0,
        get: function () {
          return i;
        },
      });
    let d = a.r(87924),
      e = a.r(35112),
      f = a.r(56704),
      g = a.r(7773),
      h = a.r(68063);
    function i({ moduleIds: a }) {
      let b = f.workAsyncStorage.getStore();
      if (void 0 === b) return null;
      let c = [];
      if (b.reactLoadableManifest && a) {
        let d = b.reactLoadableManifest;
        for (let b of a) {
          if (!d[b]) continue;
          let a = d[b].files;
          c.push(...a);
        }
      }
      if (0 === c.length) return null;
      let j = (0, h.getAssetTokenQuery)();
      return (0, d.jsx)(d.Fragment, {
        children: c.map((a) => {
          let c = `${b.assetPrefix}/_next/${(0, g.encodeURIPath)(a)}${j}`;
          return a.endsWith('.css')
            ? (0, d.jsx)(
                'link',
                { precedence: 'dynamic', href: c, rel: 'stylesheet', as: 'style', nonce: b.nonce },
                a
              )
            : ((0, e.preload)(c, { as: 'script', fetchPriority: 'low', nonce: b.nonce }), null);
        }),
      });
    }
  },
  69853,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'default', {
        enumerable: !0,
        get: function () {
          return j;
        },
      });
    let d = a.r(87924),
      e = a.r(72131),
      f = a.r(32245),
      g = a.r(97458);
    function h(a) {
      return { default: a && 'default' in a ? a.default : a };
    }
    let i = { loader: () => Promise.resolve(h(() => null)), loading: null, ssr: !0 },
      j = function (a) {
        let b = { ...i, ...a },
          c = (0, e.lazy)(() => b.loader().then(h)),
          j = b.loading;
        function k(a) {
          let h = j ? (0, d.jsx)(j, { isLoading: !0, pastDelay: !0, error: null }) : null,
            i = !b.ssr || !!b.loading,
            k = i ? e.Suspense : e.Fragment,
            l = b.ssr
              ? (0, d.jsxs)(d.Fragment, {
                  children: [
                    (0, d.jsx)(g.PreloadChunks, { moduleIds: b.modules }),
                    (0, d.jsx)(c, { ...a }),
                  ],
                })
              : (0, d.jsx)(f.BailoutToCSR, {
                  reason: 'next/dynamic',
                  children: (0, d.jsx)(c, { ...a }),
                });
          return (0, d.jsx)(k, { ...(i ? { fallback: h } : {}), children: l });
        }
        return (k.displayName = 'LoadableComponent'), k;
      };
  },
  19721,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'default', {
        enumerable: !0,
        get: function () {
          return e;
        },
      });
    let d = a.r(33354)._(a.r(69853));
    function e(a, b) {
      let c = {};
      'function' == typeof a && (c.loader = a);
      let e = { ...c, ...b };
      return (0, d.default)({ ...e, modules: e.loadableGenerated?.modules });
    }
    ('function' == typeof c.default || ('object' == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, '__esModule', { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default));
  },
  60724,
  (a) => {
    'use strict';
    var b = a.i(87924),
      c = a.i(72131),
      d = a.i(3637);
    let e = (0, a.i(19721).default)(async () => {}, {
      loadableGenerated: { modules: [5076] },
      ssr: !1,
      loading: () =>
        (0, b.jsx)('div', {
          className:
            'w-full h-[600px] border border-slate-800 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400',
          children: (0, b.jsxs)('div', {
            className: 'flex flex-col items-center gap-3',
            children: [
              (0, b.jsx)('div', {
                className:
                  'w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin',
              }),
              (0, b.jsx)('p', {
                className: 'text-xs font-semibold uppercase tracking-wider',
                children: 'Loading Leaflet Map canvas...',
              }),
            ],
          }),
        }),
    });
    function f(a) {
      return (0, b.jsx)(e, { ...a });
    }
    a.s(
      [
        'default',
        0,
        function () {
          let { isAuthenticated: a, isLoading: e, user: g, login: h, logout: i } = (0, d.useAuth)(),
            [j, k] = (0, c.useState)([]),
            [l, m] = (0, c.useState)([]),
            [n, o] = (0, c.useState)(!1),
            [p, q] = (0, c.useState)(null),
            [r, s] = (0, c.useState)(''),
            t = () => {
              let a = [
                {
                  id: '18',
                  name: 'SANGO STATION',
                  code: 'Station #18',
                  type: 'CUSTOMER',
                  status: 'ACTIVE',
                  capacity_m3_h: 4500,
                  pressure_rating_bar: 18.2,
                  location: { type: 'Point', coordinates: [3.415, 6.845] },
                  metadata: {
                    meter_type: 'Ultrasonic',
                    contracted_volume: '4.5 MMSCFD',
                    operating_pressure: '18 bar',
                    last_maintenance: '10 Apr 2026',
                    inlet_pressure: '17.8 bar',
                    flow: '3.9 MMSCFD',
                    uptime: '99.1%',
                  },
                },
                {
                  id: '19',
                  name: 'OTA DISTRIBUTION NODE',
                  code: 'Station #19',
                  type: 'REGULATOR',
                  status: 'ACTIVE',
                  capacity_m3_h: 6e3,
                  pressure_rating_bar: 22,
                  location: { type: 'Point', coordinates: [3.465, 6.838] },
                  metadata: {
                    meter_type: 'Turbine',
                    contracted_volume: '6.0 MMSCFD',
                    operating_pressure: '21 bar',
                    last_maintenance: '12 Apr 2026',
                    inlet_pressure: '20.5 bar',
                    flow: '5.2 MMSCFD',
                    uptime: '99.6%',
                  },
                },
                {
                  id: '20',
                  name: 'ALAGBOLE CITY GATE',
                  code: 'Station #20',
                  type: 'CITY_GATE',
                  status: 'ACTIVE',
                  capacity_m3_h: 8e3,
                  pressure_rating_bar: 25,
                  location: { type: 'Point', coordinates: [3.385, 6.828] },
                  metadata: {
                    meter_type: 'Ultrasonic',
                    contracted_volume: '8.0 MMSCFD',
                    operating_pressure: '24 bar',
                    last_maintenance: '08 Apr 2026',
                    inlet_pressure: '23.4 bar',
                    flow: '7.1 MMSCFD',
                    uptime: '99.8%',
                  },
                },
                {
                  id: '21',
                  name: 'OLAM NIG. LTD.',
                  code: 'Station #21',
                  type: 'CUSTOMER',
                  status: 'ACTIVE',
                  capacity_m3_h: 5e3,
                  pressure_rating_bar: 20,
                  location: { type: 'Point', coordinates: [3.4402, 6.8378] },
                  metadata: {
                    meter_type: 'Ultrasonic',
                    contracted_volume: '5.0 MMSCFD',
                    operating_pressure: '19 bar',
                    last_maintenance: '14 Apr 2026',
                    inlet_pressure: '18.6 bar',
                    flow: '4.2 MMSCFD',
                    uptime: '99.4%',
                  },
                },
                {
                  id: '22',
                  name: 'AJUWON REGULATOR',
                  code: 'Station #22',
                  type: 'REGULATOR',
                  status: 'ACTIVE',
                  capacity_m3_h: 4e3,
                  pressure_rating_bar: 15,
                  location: { type: 'Point', coordinates: [3.445, 6.808] },
                  metadata: {
                    meter_type: 'Rotary',
                    contracted_volume: '3.5 MMSCFD',
                    operating_pressure: '14 bar',
                    last_maintenance: '05 Apr 2026',
                    inlet_pressure: '13.2 bar',
                    flow: '3.1 MMSCFD',
                    uptime: '98.9%',
                  },
                },
                {
                  id: '23',
                  name: 'OFADA TAP-OFF',
                  code: 'Station #23',
                  type: 'CUSTOMER',
                  status: 'ACTIVE',
                  capacity_m3_h: 3e3,
                  pressure_rating_bar: 16,
                  location: { type: 'Point', coordinates: [3.455, 6.778] },
                  metadata: {
                    meter_type: 'Ultrasonic',
                    contracted_volume: '3.0 MMSCFD',
                    operating_pressure: '15 bar',
                    last_maintenance: '11 Apr 2026',
                    inlet_pressure: '14.5 bar',
                    flow: '2.6 MMSCFD',
                    uptime: '99.2%',
                  },
                },
              ];
              k(a), q(a[3]);
            };
          if (
            ((0, c.useEffect)(() => {
              a &&
                g &&
                (async () => {
                  o(!0);
                  try {
                    let a = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
                      [b, c] = await Promise.all([
                        fetch(`${a}/gis/stations`),
                        fetch(`${a}/gis/pipelines`),
                      ]),
                      d = !1;
                    if (b.ok) {
                      let a = await b.json();
                      a && a.length > 0 && (k(a), q(a[0]), (d = !0));
                    }
                    if (c.ok) {
                      let a = await c.json();
                      m(a);
                    }
                    d || t();
                  } catch (a) {
                    console.error('Error fetching GIS infrastructure layers:', a), t();
                  } finally {
                    o(!1);
                  }
                })();
            }, [a, g]),
            e)
          )
            return (0, b.jsx)('div', {
              className: 'min-h-screen flex items-center justify-center bg-[#022c16] text-white',
              children: (0, b.jsxs)('div', {
                className: 'flex flex-col items-center gap-4',
                children: [
                  (0, b.jsx)('div', {
                    className:
                      'w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin',
                  }),
                  (0, b.jsx)('p', {
                    className: 'text-emerald-200 text-sm font-medium tracking-wide',
                    children: 'Initializing GasGrid IAM Gateway...',
                  }),
                ],
              }),
            });
          let u = r
            ? j.filter(
                (a) =>
                  a.name.toLowerCase().includes(r.toLowerCase()) ||
                  a.code.toLowerCase().includes(r.toLowerCase())
              )
            : j;
          return (0, b.jsxs)('div', {
            className: 'min-h-screen flex bg-slate-100 text-slate-800 font-sans',
            children: [
              (0, b.jsxs)('aside', {
                className:
                  'w-64 bg-[#01381d] text-white flex flex-col justify-between shrink-0 shadow-xl z-20',
                children: [
                  (0, b.jsxs)('div', {
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'p-5 flex items-center gap-3 border-b border-emerald-900/50',
                        children: [
                          (0, b.jsxs)('div', {
                            className:
                              'relative w-10 h-10 shrink-0 flex items-center justify-center',
                            children: [
                              (0, b.jsx)('div', {
                                className:
                                  'absolute inset-0 bg-amber-400 rounded-tr-xl rounded-bl-xl transform -rotate-12',
                              }),
                              (0, b.jsx)('div', {
                                className:
                                  'absolute inset-1 bg-emerald-700 rounded-tr-lg rounded-bl-lg transform rotate-12 flex items-center justify-center',
                                children: (0, b.jsx)('span', {
                                  className: 'text-white text-[10px] font-black tracking-tighter',
                                  children: 'NNPC',
                                }),
                              }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            children: [
                              (0, b.jsx)('h1', {
                                className:
                                  'text-xs font-black leading-none text-amber-400 tracking-wider',
                                children: 'NNPC',
                              }),
                              (0, b.jsx)('p', {
                                className:
                                  'text-[9px] text-slate-200 font-bold uppercase tracking-tight leading-tight',
                                children: 'Gas Marketing Limited',
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)('nav', {
                        className: 'p-4 space-y-1',
                        children: [
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg bg-[#002a14] text-amber-400 border-l-4 border-amber-400 font-semibold transition duration-150',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z',
                                }),
                              }),
                              'Dashboard',
                            ],
                          }),
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, b.jsxs)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: [
                                  (0, b.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                                  }),
                                  (0, b.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                                  }),
                                ],
                              }),
                              'Map',
                            ],
                          }),
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                                }),
                              }),
                              'Stations',
                            ],
                          }),
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M13 10V3L4 14h7v7l9-11h-7z',
                                }),
                              }),
                              'IoT Monitoring',
                            ],
                          }),
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                                }),
                              }),
                              'Reports',
                            ],
                          }),
                          (0, b.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, b.jsxs)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: [
                                  (0, b.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                                  }),
                                  (0, b.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
                                  }),
                                ],
                              }),
                              'Settings',
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className:
                      'p-4 border-t border-emerald-900/50 bg-[#002713] flex flex-col gap-1',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'flex items-center gap-2 text-amber-400 font-bold text-xs',
                        children: [
                          (0, b.jsx)('span', {
                            className: 'w-2 h-2 rounded-full bg-amber-400 animate-pulse',
                          }),
                          'GasGrid',
                        ],
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-[10px] text-emerald-200',
                        children: 'Gas Distribution Management Platform',
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'flex-1 flex flex-col min-w-0',
                children: [
                  (0, b.jsxs)('header', {
                    className:
                      'h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-10 shrink-0',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'relative w-80',
                        children: [
                          (0, b.jsx)('span', {
                            className:
                              'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400',
                            children: (0, b.jsx)('svg', {
                              className: 'w-4 h-4',
                              fill: 'none',
                              stroke: 'currentColor',
                              viewBox: '0 0 24 24',
                              children: (0, b.jsx)('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: '2',
                                d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                              }),
                            }),
                          }),
                          (0, b.jsx)('input', {
                            type: 'text',
                            placeholder: 'Search stations...',
                            value: r,
                            onChange: (a) => s(a.target.value),
                            className:
                              'w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:bg-white focus:border-[#01381d] transition-all',
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'flex items-center gap-4',
                        children: [
                          (0, b.jsxs)('div', {
                            className:
                              'flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold',
                            children: [
                              (0, b.jsx)('span', {
                                className:
                                  'w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black',
                                children: '2',
                              }),
                              '2 alerts',
                            ],
                          }),
                          (0, b.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-4 h-4 text-slate-500',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
                                }),
                              }),
                              'Upload CSV',
                            ],
                          }),
                          (0, b.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3.5 py-1.5 bg-[#01381d] text-white rounded-lg text-xs font-semibold hover:bg-[#002713] transition shadow-sm',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-4 h-4',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M12 4v16m8-8H4',
                                }),
                              }),
                              'Add Station',
                            ],
                          }),
                          (0, b.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm',
                            children: [
                              (0, b.jsx)('svg', {
                                className: 'w-4 h-4',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, b.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                                }),
                              }),
                              'Export PDF',
                            ],
                          }),
                          a
                            ? (0, b.jsxs)('div', {
                                className: 'flex items-center gap-2 border-l border-slate-200 pl-4',
                                children: [
                                  (0, b.jsx)('div', {
                                    className:
                                      'w-8 h-8 rounded-full bg-amber-400 text-[#01381d] font-bold flex items-center justify-center text-xs shadow-xs',
                                    children: 'NG',
                                  }),
                                  (0, b.jsx)('button', {
                                    onClick: i,
                                    className:
                                      'text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition',
                                    children: 'Logout',
                                  }),
                                ],
                              })
                            : (0, b.jsx)('button', {
                                onClick: h,
                                className: 'text-xs font-bold text-[#01381d] hover:underline',
                                children: 'Sign In',
                              }),
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsx)('main', {
                    className: 'flex-1 flex overflow-hidden relative',
                    children: a
                      ? (0, b.jsxs)(b.Fragment, {
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'flex-1 h-full relative z-10',
                              children: [
                                n
                                  ? (0, b.jsx)('div', {
                                      className:
                                        'absolute inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center z-30',
                                      children: (0, b.jsxs)('div', {
                                        className:
                                          'bg-white p-6 rounded-xl shadow-lg border border-slate-150 flex items-center gap-3',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin',
                                          }),
                                          (0, b.jsx)('span', {
                                            className: 'text-xs font-bold text-[#01381d]',
                                            children: 'Loading Spatial Layers...',
                                          }),
                                        ],
                                      }),
                                    })
                                  : null,
                                (0, b.jsx)(f, {
                                  userToken: g?.token || '',
                                  userRoles: g?.roles || [],
                                  stations: u,
                                  pipelines: l,
                                  onStationCreated: (a) => {
                                    k((b) => [...b, a]), q(a);
                                  },
                                  onPipelineCreated: (a) => {
                                    m((b) => [...b, a]);
                                  },
                                  onStationSelected: q,
                                  selectedStation: p,
                                }),
                              ],
                            }),
                            p &&
                              (0, b.jsxs)('aside', {
                                className:
                                  'w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg z-25 overflow-y-auto',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className:
                                      'p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center gap-3',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'w-10 h-10 rounded-full bg-[#01381d] flex items-center justify-center text-white shrink-0',
                                            children: (0, b.jsx)('svg', {
                                              className: 'w-5 h-5 text-emerald-400',
                                              fill: 'currentColor',
                                              viewBox: '0 0 20 20',
                                              children: (0, b.jsx)('path', {
                                                fillRule: 'evenodd',
                                                d: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.317.766-.699 1.719-1.01 2.593a40.39 40.39 0 00-1.01-2.593c-.167-.403-.356-.785-.57-1.116-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.247.37-.417.847-.468 1.397-.05.549.03 1.19.23 1.874.402 1.37 1.203 2.923 2.115 4.148-.716.148-1.417.472-2.007.973-.59.5-1.002 1.168-1.193 1.944-.191.776-.118 1.63.228 2.404a5.976 5.976 0 002.13 2.422c.98.665 2.155 1.022 3.36 1.022s2.38-.357 3.36-1.022a5.976 5.976 0 002.13-2.422c.346-.774.419-1.628.228-2.404a5.978 5.978 0 00-1.193-1.944c-.59-.5-1.291-.825-2.007-.973.912-1.225 1.713-2.778 2.115-4.148.2-.684.28-1.325.23-1.874-.051-.55-.22-1.027-.468-1.397zM10 18a4 4 0 01-4-4c0-1.453.766-2.576 1.716-3.238A6.035 6.035 0 0010 12c.94 0 1.782-.24 2.284-.476C13.234 11.424 14 12.547 14 14a4 4 0 01-4 4z',
                                                clipRule: 'evenodd',
                                              }),
                                            }),
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('h2', {
                                                className: 'font-bold text-slate-800 leading-tight',
                                                children: p.name,
                                              }),
                                              (0, b.jsxs)('div', {
                                                className: 'flex items-center gap-2',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    className: 'text-xs text-slate-500',
                                                    children: p.code,
                                                  }),
                                                  (0, b.jsx)('span', {
                                                    className:
                                                      'bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                                                    children: p.status,
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsx)('button', {
                                        onClick: () => q(null),
                                        className:
                                          'text-slate-400 hover:text-slate-600 transition p-1',
                                        children: (0, b.jsx)('svg', {
                                          className: 'w-5 h-5',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: (0, b.jsx)('path', {
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeWidth: '2',
                                            d: 'M6 18L18 6M6 6l12 12',
                                          }),
                                        }),
                                      }),
                                    ],
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex-1 p-4 space-y-5',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        className: 'space-y-2.5 text-sm',
                                        children: [
                                          (0, b.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, b.jsxs)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: [
                                                      (0, b.jsx)('path', {
                                                        strokeLinecap: 'round',
                                                        strokeLinejoin: 'round',
                                                        strokeWidth: '2',
                                                        d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                                                      }),
                                                      (0, b.jsx)('path', {
                                                        strokeLinecap: 'round',
                                                        strokeLinejoin: 'round',
                                                        strokeWidth: '2',
                                                        d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                                                      }),
                                                    ],
                                                  }),
                                                  'Coordinates',
                                                ],
                                              }),
                                              (0, b.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children: p.location?.coordinates
                                                  ? `${p.location.coordinates[1].toFixed(
                                                      5
                                                    )} N ${p.location.coordinates[0].toFixed(5)} E`
                                                  : 'N/A',
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, b.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, b.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                                                    }),
                                                  }),
                                                  'Meter type',
                                                ],
                                              }),
                                              (0, b.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children: p.metadata?.meter_type || 'Ultrasonic',
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, b.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, b.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z',
                                                    }),
                                                  }),
                                                  'Contracted volume',
                                                ],
                                              }),
                                              (0, b.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  p.metadata?.contracted_volume || '5.0 MMSCFD',
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, b.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, b.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                    }),
                                                  }),
                                                  'Operating pressure',
                                                ],
                                              }),
                                              (0, b.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  p.metadata?.operating_pressure ||
                                                  `${p.pressure_rating_bar} bar`,
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, b.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, b.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
                                                    }),
                                                  }),
                                                  'Last maintenance',
                                                ],
                                              }),
                                              (0, b.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  p.metadata?.last_maintenance || '14 Apr 2026',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className:
                                          'bg-slate-50 p-4 rounded-xl border border-slate-150',
                                        children: [
                                          (0, b.jsxs)('div', {
                                            className: 'flex items-center justify-between mb-2',
                                            children: [
                                              (0, b.jsx)('span', {
                                                className:
                                                  'text-xs font-bold text-slate-500 uppercase tracking-wider',
                                                children: 'Live Flow (MMSCFD)',
                                              }),
                                              (0, b.jsxs)('span', {
                                                className:
                                                  'flex items-center gap-1 text-[10px] text-emerald-600 font-bold',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping',
                                                  }),
                                                  'Live',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className: 'h-24 w-full relative',
                                            children: [
                                              (0, b.jsxs)('svg', {
                                                className: 'w-full h-full',
                                                viewBox: '0 0 100 30',
                                                preserveAspectRatio: 'none',
                                                children: [
                                                  (0, b.jsx)('path', {
                                                    d: 'M 0 15 Q 15 12 25 18 T 50 10 T 75 14 T 100 16',
                                                    fill: 'none',
                                                    stroke: '#10b981',
                                                    strokeWidth: '1.5',
                                                    strokeLinecap: 'round',
                                                  }),
                                                  (0, b.jsx)('circle', {
                                                    cx: '100',
                                                    cy: '16',
                                                    r: '2.5',
                                                    fill: '#10b981',
                                                  }),
                                                ],
                                              }),
                                              (0, b.jsxs)('div', {
                                                className:
                                                  'absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-400 mt-1',
                                                children: [
                                                  (0, b.jsx)('span', { children: '00:00' }),
                                                  (0, b.jsx)('span', { children: '08:00' }),
                                                  (0, b.jsx)('span', { children: '16:00' }),
                                                  (0, b.jsx)('span', { children: '24:00' }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'grid grid-cols-3 gap-2 text-center',
                                        children: [
                                          (0, b.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, b.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Inlet Pressure',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: p.metadata?.inlet_pressure || '18.6 bar',
                                              }),
                                              (0, b.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500',
                                                  }),
                                                  'Normal',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, b.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Flow Rate',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: p.metadata?.flow || '4.2 MMSCFD',
                                              }),
                                              (0, b.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500',
                                                  }),
                                                  'Normal',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, b.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Uptime',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: p.metadata?.uptime || '99.4%',
                                              }),
                                              (0, b.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500',
                                                  }),
                                                  'Online',
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)('div', {
                                    className: 'p-4 border-t border-slate-100 bg-slate-50/50',
                                    children: (0, b.jsxs)('a', {
                                      href: '#',
                                      className:
                                        'flex items-center justify-between text-xs font-bold text-[#01381d] hover:text-[#002713] transition group',
                                      children: [
                                        'View full station details',
                                        (0, b.jsx)('svg', {
                                          className:
                                            'w-4 h-4 transform group-hover:translate-x-1 transition-transform',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: (0, b.jsx)('path', {
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeWidth: '2',
                                            d: 'M9 5l7 7-7 7',
                                          }),
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                          ],
                        })
                      : (0, b.jsx)('div', {
                          className: 'flex-1 flex items-center justify-center p-8 bg-slate-100',
                          children: (0, b.jsxs)('div', {
                            className:
                              'w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center',
                            children: [
                              (0, b.jsx)('h2', {
                                className: 'text-2xl font-bold text-[#01381d] mb-2',
                                children: 'NGML GasGrid',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-slate-500 text-sm mb-6',
                                children:
                                  'Access the Gas Distribution Management Portal via secure IAM Gateway.',
                              }),
                              (0, b.jsx)('button', {
                                onClick: h,
                                className:
                                  'w-full py-2.5 bg-[#01381d] hover:bg-[#002713] text-white rounded-lg font-semibold transition shadow-sm',
                                children: 'Sign In with Keycloak',
                              }),
                            ],
                          }),
                        }),
                  }),
                ],
              }),
            ],
          });
        },
      ],
      60724
    );
  },
];

//# sourceMappingURL=_1659exj._.js.map
