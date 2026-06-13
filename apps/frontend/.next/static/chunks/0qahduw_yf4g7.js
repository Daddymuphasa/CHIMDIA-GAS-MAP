(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  67585,
  (e, t, s) => {
    'use strict';
    Object.defineProperty(s, '__esModule', { value: !0 }),
      Object.defineProperty(s, 'BailoutToCSR', {
        enumerable: !0,
        get: function () {
          return r;
        },
      });
    let a = e.r(32061);
    function r({ reason: e, children: t }) {
      if ('u' < typeof window)
        throw Object.defineProperty(new a.BailoutToCSRError(e), '__NEXT_ERROR_CODE', {
          value: 'E394',
          enumerable: !1,
          configurable: !0,
        });
      return t;
    }
  },
  9885,
  (e, t, s) => {
    'use strict';
    function a(e) {
      return e
        .split('/')
        .map((e) => encodeURIComponent(e))
        .join('/');
    }
    Object.defineProperty(s, '__esModule', { value: !0 }),
      Object.defineProperty(s, 'encodeURIPath', {
        enumerable: !0,
        get: function () {
          return a;
        },
      });
  },
  52157,
  (e, t, s) => {
    'use strict';
    Object.defineProperty(s, '__esModule', { value: !0 }),
      Object.defineProperty(s, 'PreloadChunks', {
        enumerable: !0,
        get: function () {
          return o;
        },
      });
    let a = e.r(43476),
      r = e.r(74080),
      n = e.r(63599),
      l = e.r(9885),
      i = e.r(43369);
    function o({ moduleIds: e }) {
      if ('u' > typeof window) return null;
      let t = n.workAsyncStorage.getStore();
      if (void 0 === t) return null;
      let s = [];
      if (t.reactLoadableManifest && e) {
        let a = t.reactLoadableManifest;
        for (let t of e) {
          if (!a[t]) continue;
          let e = a[t].files;
          s.push(...e);
        }
      }
      if (0 === s.length) return null;
      let d = (0, i.getAssetTokenQuery)();
      return (0, a.jsx)(a.Fragment, {
        children: s.map((e) => {
          let s = `${t.assetPrefix}/_next/${(0, l.encodeURIPath)(e)}${d}`;
          return e.endsWith('.css')
            ? (0, a.jsx)(
                'link',
                { precedence: 'dynamic', href: s, rel: 'stylesheet', as: 'style', nonce: t.nonce },
                e
              )
            : ((0, r.preload)(s, { as: 'script', fetchPriority: 'low', nonce: t.nonce }), null);
        }),
      });
    }
  },
  69093,
  (e, t, s) => {
    'use strict';
    Object.defineProperty(s, '__esModule', { value: !0 }),
      Object.defineProperty(s, 'default', {
        enumerable: !0,
        get: function () {
          return d;
        },
      });
    let a = e.r(43476),
      r = e.r(71645),
      n = e.r(67585),
      l = e.r(52157);
    function i(e) {
      return { default: e && 'default' in e ? e.default : e };
    }
    let o = { loader: () => Promise.resolve(i(() => null)), loading: null, ssr: !0 },
      d = function (e) {
        let t = { ...o, ...e },
          s = (0, r.lazy)(() => t.loader().then(i)),
          d = t.loading;
        function c(e) {
          let i = d ? (0, a.jsx)(d, { isLoading: !0, pastDelay: !0, error: null }) : null,
            o = !t.ssr || !!t.loading,
            c = o ? r.Suspense : r.Fragment,
            x = t.ssr
              ? (0, a.jsxs)(a.Fragment, {
                  children: [
                    'u' < typeof window
                      ? (0, a.jsx)(l.PreloadChunks, { moduleIds: t.modules })
                      : null,
                    (0, a.jsx)(s, { ...e }),
                  ],
                })
              : (0, a.jsx)(n.BailoutToCSR, {
                  reason: 'next/dynamic',
                  children: (0, a.jsx)(s, { ...e }),
                });
          return (0, a.jsx)(c, { ...(o ? { fallback: i } : {}), children: x });
        }
        return (c.displayName = 'LoadableComponent'), c;
      };
  },
  70703,
  (e, t, s) => {
    'use strict';
    Object.defineProperty(s, '__esModule', { value: !0 }),
      Object.defineProperty(s, 'default', {
        enumerable: !0,
        get: function () {
          return r;
        },
      });
    let a = e.r(55682)._(e.r(69093));
    function r(e, t) {
      let s = {};
      'function' == typeof e && (s.loader = e);
      let r = { ...s, ...t };
      return (0, a.default)({ ...r, modules: r.loadableGenerated?.modules });
    }
    ('function' == typeof s.default || ('object' == typeof s.default && null !== s.default)) &&
      void 0 === s.default.__esModule &&
      (Object.defineProperty(s.default, '__esModule', { value: !0 }),
      Object.assign(s.default, s),
      (t.exports = s.default));
  },
  96345,
  (e) => {
    'use strict';
    var t = e.i(47167),
      s = e.i(43476),
      a = e.i(71645),
      r = e.i(13870);
    let n = (0, e.i(70703).default)(() => e.A(44636), {
      loadableGenerated: { modules: [5076] },
      ssr: !1,
      loading: () =>
        (0, s.jsx)('div', {
          className:
            'w-full h-[600px] border border-slate-800 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400',
          children: (0, s.jsxs)('div', {
            className: 'flex flex-col items-center gap-3',
            children: [
              (0, s.jsx)('div', {
                className:
                  'w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin',
              }),
              (0, s.jsx)('p', {
                className: 'text-xs font-semibold uppercase tracking-wider',
                children: 'Loading Leaflet Map canvas...',
              }),
            ],
          }),
        }),
    });
    function l(e) {
      return (0, s.jsx)(n, { ...e });
    }
    e.s(
      [
        'default',
        0,
        function () {
          let { isAuthenticated: e, isLoading: n, user: i, login: o, logout: d } = (0, r.useAuth)(),
            [c, x] = (0, a.useState)([]),
            [m, u] = (0, a.useState)([]),
            [h, p] = (0, a.useState)(!1),
            [f, b] = (0, a.useState)(null),
            [j, g] = (0, a.useState)(''),
            v = () => {
              let e = [
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
              x(e), b(e[3]);
            };
          if (
            ((0, a.useEffect)(() => {
              e &&
                i &&
                (async () => {
                  p(!0);
                  try {
                    let e = t.default.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
                      [s, a] = await Promise.all([
                        fetch(`${e}/gis/stations`),
                        fetch(`${e}/gis/pipelines`),
                      ]),
                      r = !1;
                    if (s.ok) {
                      let e = await s.json();
                      e && e.length > 0 && (x(e), b(e[0]), (r = !0));
                    }
                    if (a.ok) {
                      let e = await a.json();
                      u(e);
                    }
                    r || v();
                  } catch (e) {
                    console.error('Error fetching GIS infrastructure layers:', e), v();
                  } finally {
                    p(!1);
                  }
                })();
            }, [e, i]),
            n)
          )
            return (0, s.jsx)('div', {
              className: 'min-h-screen flex items-center justify-center bg-[#022c16] text-white',
              children: (0, s.jsxs)('div', {
                className: 'flex flex-col items-center gap-4',
                children: [
                  (0, s.jsx)('div', {
                    className:
                      'w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin',
                  }),
                  (0, s.jsx)('p', {
                    className: 'text-emerald-200 text-sm font-medium tracking-wide',
                    children: 'Initializing GasGrid IAM Gateway...',
                  }),
                ],
              }),
            });
          let N = j
            ? c.filter(
                (e) =>
                  e.name.toLowerCase().includes(j.toLowerCase()) ||
                  e.code.toLowerCase().includes(j.toLowerCase())
              )
            : c;
          return (0, s.jsxs)('div', {
            className: 'min-h-screen flex bg-slate-100 text-slate-800 font-sans',
            children: [
              (0, s.jsxs)('aside', {
                className:
                  'w-64 bg-[#01381d] text-white flex flex-col justify-between shrink-0 shadow-xl z-20',
                children: [
                  (0, s.jsxs)('div', {
                    children: [
                      (0, s.jsxs)('div', {
                        className: 'p-5 flex items-center gap-3 border-b border-emerald-900/50',
                        children: [
                          (0, s.jsxs)('div', {
                            className:
                              'relative w-10 h-10 shrink-0 flex items-center justify-center',
                            children: [
                              (0, s.jsx)('div', {
                                className:
                                  'absolute inset-0 bg-amber-400 rounded-tr-xl rounded-bl-xl transform -rotate-12',
                              }),
                              (0, s.jsx)('div', {
                                className:
                                  'absolute inset-1 bg-emerald-700 rounded-tr-lg rounded-bl-lg transform rotate-12 flex items-center justify-center',
                                children: (0, s.jsx)('span', {
                                  className: 'text-white text-[10px] font-black tracking-tighter',
                                  children: 'NNPC',
                                }),
                              }),
                            ],
                          }),
                          (0, s.jsxs)('div', {
                            children: [
                              (0, s.jsx)('h1', {
                                className:
                                  'text-xs font-black leading-none text-amber-400 tracking-wider',
                                children: 'NNPC',
                              }),
                              (0, s.jsx)('p', {
                                className:
                                  'text-[9px] text-slate-200 font-bold uppercase tracking-tight leading-tight',
                                children: 'Gas Marketing Limited',
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, s.jsxs)('nav', {
                        className: 'p-4 space-y-1',
                        children: [
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg bg-[#002a14] text-amber-400 border-l-4 border-amber-400 font-semibold transition duration-150',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z',
                                }),
                              }),
                              'Dashboard',
                            ],
                          }),
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, s.jsxs)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: [
                                  (0, s.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                                  }),
                                  (0, s.jsx)('path', {
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
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                                }),
                              }),
                              'Stations',
                            ],
                          }),
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M13 10V3L4 14h7v7l9-11h-7z',
                                }),
                              }),
                              'IoT Monitoring',
                            ],
                          }),
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                                }),
                              }),
                              'Reports',
                            ],
                          }),
                          (0, s.jsxs)('a', {
                            href: '#',
                            className:
                              'flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150',
                            children: [
                              (0, s.jsxs)('svg', {
                                className: 'w-5 h-5',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: [
                                  (0, s.jsx)('path', {
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    strokeWidth: '2',
                                    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                                  }),
                                  (0, s.jsx)('path', {
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
                  (0, s.jsxs)('div', {
                    className:
                      'p-4 border-t border-emerald-900/50 bg-[#002713] flex flex-col gap-1',
                    children: [
                      (0, s.jsxs)('div', {
                        className: 'flex items-center gap-2 text-amber-400 font-bold text-xs',
                        children: [
                          (0, s.jsx)('span', {
                            className: 'w-2 h-2 rounded-full bg-amber-400 animate-pulse',
                          }),
                          'GasGrid',
                        ],
                      }),
                      (0, s.jsx)('p', {
                        className: 'text-[10px] text-emerald-200',
                        children: 'Gas Distribution Management Platform',
                      }),
                    ],
                  }),
                ],
              }),
              (0, s.jsxs)('div', {
                className: 'flex-1 flex flex-col min-w-0',
                children: [
                  (0, s.jsxs)('header', {
                    className:
                      'h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-10 shrink-0',
                    children: [
                      (0, s.jsxs)('div', {
                        className: 'relative w-80',
                        children: [
                          (0, s.jsx)('span', {
                            className:
                              'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400',
                            children: (0, s.jsx)('svg', {
                              className: 'w-4 h-4',
                              fill: 'none',
                              stroke: 'currentColor',
                              viewBox: '0 0 24 24',
                              children: (0, s.jsx)('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: '2',
                                d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                              }),
                            }),
                          }),
                          (0, s.jsx)('input', {
                            type: 'text',
                            placeholder: 'Search stations...',
                            value: j,
                            onChange: (e) => g(e.target.value),
                            className:
                              'w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:bg-white focus:border-[#01381d] transition-all',
                          }),
                        ],
                      }),
                      (0, s.jsxs)('div', {
                        className: 'flex items-center gap-4',
                        children: [
                          (0, s.jsxs)('div', {
                            className:
                              'flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold',
                            children: [
                              (0, s.jsx)('span', {
                                className:
                                  'w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black',
                                children: '2',
                              }),
                              '2 alerts',
                            ],
                          }),
                          (0, s.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-4 h-4 text-slate-500',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
                                }),
                              }),
                              'Upload CSV',
                            ],
                          }),
                          (0, s.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3.5 py-1.5 bg-[#01381d] text-white rounded-lg text-xs font-semibold hover:bg-[#002713] transition shadow-sm',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-4 h-4',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M12 4v16m8-8H4',
                                }),
                              }),
                              'Add Station',
                            ],
                          }),
                          (0, s.jsxs)('button', {
                            className:
                              'flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm',
                            children: [
                              (0, s.jsx)('svg', {
                                className: 'w-4 h-4',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, s.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: '2',
                                  d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                                }),
                              }),
                              'Export PDF',
                            ],
                          }),
                          e
                            ? (0, s.jsxs)('div', {
                                className: 'flex items-center gap-2 border-l border-slate-200 pl-4',
                                children: [
                                  (0, s.jsx)('div', {
                                    className:
                                      'w-8 h-8 rounded-full bg-amber-400 text-[#01381d] font-bold flex items-center justify-center text-xs shadow-xs',
                                    children: 'NG',
                                  }),
                                  (0, s.jsx)('button', {
                                    onClick: d,
                                    className:
                                      'text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition',
                                    children: 'Logout',
                                  }),
                                ],
                              })
                            : (0, s.jsx)('button', {
                                onClick: o,
                                className: 'text-xs font-bold text-[#01381d] hover:underline',
                                children: 'Sign In',
                              }),
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsx)('main', {
                    className: 'flex-1 flex overflow-hidden relative',
                    children: e
                      ? (0, s.jsxs)(s.Fragment, {
                          children: [
                            (0, s.jsxs)('div', {
                              className: 'flex-1 h-full relative z-10',
                              children: [
                                h
                                  ? (0, s.jsx)('div', {
                                      className:
                                        'absolute inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center z-30',
                                      children: (0, s.jsxs)('div', {
                                        className:
                                          'bg-white p-6 rounded-xl shadow-lg border border-slate-150 flex items-center gap-3',
                                        children: [
                                          (0, s.jsx)('div', {
                                            className:
                                              'w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin',
                                          }),
                                          (0, s.jsx)('span', {
                                            className: 'text-xs font-bold text-[#01381d]',
                                            children: 'Loading Spatial Layers...',
                                          }),
                                        ],
                                      }),
                                    })
                                  : null,
                                (0, s.jsx)(l, {
                                  userToken: i?.token || '',
                                  userRoles: i?.roles || [],
                                  stations: N,
                                  pipelines: m,
                                  onStationCreated: (e) => {
                                    x((t) => [...t, e]), b(e);
                                  },
                                  onPipelineCreated: (e) => {
                                    u((t) => [...t, e]);
                                  },
                                  onStationSelected: b,
                                  selectedStation: f,
                                }),
                              ],
                            }),
                            f &&
                              (0, s.jsxs)('aside', {
                                className:
                                  'w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg z-25 overflow-y-auto',
                                children: [
                                  (0, s.jsxs)('div', {
                                    className:
                                      'p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50',
                                    children: [
                                      (0, s.jsxs)('div', {
                                        className: 'flex items-center gap-3',
                                        children: [
                                          (0, s.jsx)('div', {
                                            className:
                                              'w-10 h-10 rounded-full bg-[#01381d] flex items-center justify-center text-white shrink-0',
                                            children: (0, s.jsx)('svg', {
                                              className: 'w-5 h-5 text-emerald-400',
                                              fill: 'currentColor',
                                              viewBox: '0 0 20 20',
                                              children: (0, s.jsx)('path', {
                                                fillRule: 'evenodd',
                                                d: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.317.766-.699 1.719-1.01 2.593a40.39 40.39 0 00-1.01-2.593c-.167-.403-.356-.785-.57-1.116-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.247.37-.417.847-.468 1.397-.05.549.03 1.19.23 1.874.402 1.37 1.203 2.923 2.115 4.148-.716.148-1.417.472-2.007.973-.59.5-1.002 1.168-1.193 1.944-.191.776-.118 1.63.228 2.404a5.976 5.976 0 002.13 2.422c.98.665 2.155 1.022 3.36 1.022s2.38-.357 3.36-1.022a5.976 5.976 0 002.13-2.422c.346-.774.419-1.628.228-2.404a5.978 5.978 0 00-1.193-1.944c-.59-.5-1.291-.825-2.007-.973.912-1.225 1.713-2.778 2.115-4.148.2-.684.28-1.325.23-1.874-.051-.55-.22-1.027-.468-1.397zM10 18a4 4 0 01-4-4c0-1.453.766-2.576 1.716-3.238A6.035 6.035 0 0010 12c.94 0 1.782-.24 2.284-.476C13.234 11.424 14 12.547 14 14a4 4 0 01-4 4z',
                                                clipRule: 'evenodd',
                                              }),
                                            }),
                                          }),
                                          (0, s.jsxs)('div', {
                                            children: [
                                              (0, s.jsx)('h2', {
                                                className: 'font-bold text-slate-800 leading-tight',
                                                children: f.name,
                                              }),
                                              (0, s.jsxs)('div', {
                                                className: 'flex items-center gap-2',
                                                children: [
                                                  (0, s.jsx)('span', {
                                                    className: 'text-xs text-slate-500',
                                                    children: f.code,
                                                  }),
                                                  (0, s.jsx)('span', {
                                                    className:
                                                      'bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                                                    children: f.status,
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, s.jsx)('button', {
                                        onClick: () => b(null),
                                        className:
                                          'text-slate-400 hover:text-slate-600 transition p-1',
                                        children: (0, s.jsx)('svg', {
                                          className: 'w-5 h-5',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: (0, s.jsx)('path', {
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeWidth: '2',
                                            d: 'M6 18L18 6M6 6l12 12',
                                          }),
                                        }),
                                      }),
                                    ],
                                  }),
                                  (0, s.jsxs)('div', {
                                    className: 'flex-1 p-4 space-y-5',
                                    children: [
                                      (0, s.jsxs)('div', {
                                        className: 'space-y-2.5 text-sm',
                                        children: [
                                          (0, s.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, s.jsxs)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: [
                                                      (0, s.jsx)('path', {
                                                        strokeLinecap: 'round',
                                                        strokeLinejoin: 'round',
                                                        strokeWidth: '2',
                                                        d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                                                      }),
                                                      (0, s.jsx)('path', {
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
                                              (0, s.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children: f.location?.coordinates
                                                  ? `${f.location.coordinates[1].toFixed(
                                                      5
                                                    )} N ${f.location.coordinates[0].toFixed(5)} E`
                                                  : 'N/A',
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, s.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, s.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                                                    }),
                                                  }),
                                                  'Meter type',
                                                ],
                                              }),
                                              (0, s.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children: f.metadata?.meter_type || 'Ultrasonic',
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, s.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, s.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z',
                                                    }),
                                                  }),
                                                  'Contracted volume',
                                                ],
                                              }),
                                              (0, s.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  f.metadata?.contracted_volume || '5.0 MMSCFD',
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, s.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, s.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                    }),
                                                  }),
                                                  'Operating pressure',
                                                ],
                                              }),
                                              (0, s.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  f.metadata?.operating_pressure ||
                                                  `${f.pressure_rating_bar} bar`,
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'flex justify-between py-1 border-b border-slate-100',
                                            children: [
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'text-slate-400 flex items-center gap-1.5',
                                                children: [
                                                  (0, s.jsx)('svg', {
                                                    className: 'w-4 h-4 text-slate-400',
                                                    fill: 'none',
                                                    stroke: 'currentColor',
                                                    viewBox: '0 0 24 24',
                                                    children: (0, s.jsx)('path', {
                                                      strokeLinecap: 'round',
                                                      strokeLinejoin: 'round',
                                                      strokeWidth: '2',
                                                      d: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
                                                    }),
                                                  }),
                                                  'Last maintenance',
                                                ],
                                              }),
                                              (0, s.jsx)('span', {
                                                className: 'font-medium text-slate-800',
                                                children:
                                                  f.metadata?.last_maintenance || '14 Apr 2026',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, s.jsxs)('div', {
                                        className:
                                          'bg-slate-50 p-4 rounded-xl border border-slate-150',
                                        children: [
                                          (0, s.jsxs)('div', {
                                            className: 'flex items-center justify-between mb-2',
                                            children: [
                                              (0, s.jsx)('span', {
                                                className:
                                                  'text-xs font-bold text-slate-500 uppercase tracking-wider',
                                                children: 'Live Flow (MMSCFD)',
                                              }),
                                              (0, s.jsxs)('span', {
                                                className:
                                                  'flex items-center gap-1 text-[10px] text-emerald-600 font-bold',
                                                children: [
                                                  (0, s.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping',
                                                  }),
                                                  'Live',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className: 'h-24 w-full relative',
                                            children: [
                                              (0, s.jsxs)('svg', {
                                                className: 'w-full h-full',
                                                viewBox: '0 0 100 30',
                                                preserveAspectRatio: 'none',
                                                children: [
                                                  (0, s.jsx)('path', {
                                                    d: 'M 0 15 Q 15 12 25 18 T 50 10 T 75 14 T 100 16',
                                                    fill: 'none',
                                                    stroke: '#10b981',
                                                    strokeWidth: '1.5',
                                                    strokeLinecap: 'round',
                                                  }),
                                                  (0, s.jsx)('circle', {
                                                    cx: '100',
                                                    cy: '16',
                                                    r: '2.5',
                                                    fill: '#10b981',
                                                  }),
                                                ],
                                              }),
                                              (0, s.jsxs)('div', {
                                                className:
                                                  'absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-400 mt-1',
                                                children: [
                                                  (0, s.jsx)('span', { children: '00:00' }),
                                                  (0, s.jsx)('span', { children: '08:00' }),
                                                  (0, s.jsx)('span', { children: '16:00' }),
                                                  (0, s.jsx)('span', { children: '24:00' }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, s.jsxs)('div', {
                                        className: 'grid grid-cols-3 gap-2 text-center',
                                        children: [
                                          (0, s.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, s.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Inlet Pressure',
                                              }),
                                              (0, s.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: f.metadata?.inlet_pressure || '18.6 bar',
                                              }),
                                              (0, s.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, s.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500',
                                                  }),
                                                  'Normal',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, s.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Flow Rate',
                                              }),
                                              (0, s.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: f.metadata?.flow || '4.2 MMSCFD',
                                              }),
                                              (0, s.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, s.jsx)('span', {
                                                    className:
                                                      'w-1.5 h-1.5 rounded-full bg-emerald-500',
                                                  }),
                                                  'Normal',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, s.jsxs)('div', {
                                            className:
                                              'bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between',
                                            children: [
                                              (0, s.jsx)('span', {
                                                className:
                                                  'text-[9px] text-slate-400 font-semibold uppercase leading-tight',
                                                children: 'Uptime',
                                              }),
                                              (0, s.jsx)('div', {
                                                className: 'my-1 text-sm font-black text-slate-800',
                                                children: f.metadata?.uptime || '99.4%',
                                              }),
                                              (0, s.jsxs)('div', {
                                                className:
                                                  'flex items-center justify-center gap-1 text-[9px] text-slate-500',
                                                children: [
                                                  (0, s.jsx)('span', {
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
                                  (0, s.jsx)('div', {
                                    className: 'p-4 border-t border-slate-100 bg-slate-50/50',
                                    children: (0, s.jsxs)('a', {
                                      href: '#',
                                      className:
                                        'flex items-center justify-between text-xs font-bold text-[#01381d] hover:text-[#002713] transition group',
                                      children: [
                                        'View full station details',
                                        (0, s.jsx)('svg', {
                                          className:
                                            'w-4 h-4 transform group-hover:translate-x-1 transition-transform',
                                          fill: 'none',
                                          stroke: 'currentColor',
                                          viewBox: '0 0 24 24',
                                          children: (0, s.jsx)('path', {
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
                      : (0, s.jsx)('div', {
                          className: 'flex-1 flex items-center justify-center p-8 bg-slate-100',
                          children: (0, s.jsxs)('div', {
                            className:
                              'w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center',
                            children: [
                              (0, s.jsx)('h2', {
                                className: 'text-2xl font-bold text-[#01381d] mb-2',
                                children: 'NGML GasGrid',
                              }),
                              (0, s.jsx)('p', {
                                className: 'text-slate-500 text-sm mb-6',
                                children:
                                  'Access the Gas Distribution Management Portal via secure IAM Gateway.',
                              }),
                              (0, s.jsx)('button', {
                                onClick: o,
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
      96345
    );
  },
  44636,
  (e) => {
    e.v((t) =>
      Promise.all(
        ['static/chunks/1xohlmzuoo_vn.js', 'static/chunks/0n8kzvw2z_6as.css'].map((t) => e.l(t))
      ).then(() => t(5076))
    );
  },
]);
