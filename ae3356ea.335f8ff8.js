(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{103:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),s=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=s(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),b=s(n),d=r,m=b["".concat(o,".").concat(d)]||b[d]||p[d]||i;return n?a.a.createElement(m,c(c({ref:t},u),{},{components:n})):a.a.createElement(m,c({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var u=2;u<i;u++)o[u]=n[u];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},88:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(3),a=n(7),i=(n(0),n(103)),o={id:"systemd",title:"Systemd",generated:"@generated"},c={unversionedId:"api/systemd",id:"api/systemd",isDocsHomePage:!1,title:"Systemd",description:"API",source:"@site/docs/api/gen-systemd.md",slug:"/api/systemd",permalink:"/antlir/docs/api/systemd",editUrl:"https://github.com/facebookincubator/antlir/edit/master/website/docs/api/gen-systemd.md",version:"current"},l=[{value:"<code>enable_unit</code>",id:"enable_unit",children:[]},{value:"<code>install_unit</code>",id:"install_unit",children:[]},{value:"<code>mask_tmpfiles</code>",id:"mask_tmpfiles",children:[]},{value:"<code>mask_units</code>",id:"mask_units",children:[]},{value:"<code>set_default_target</code>",id:"set_default_target",children:[]},{value:"<code>unmask_units</code>",id:"unmask_units",children:[]}],u={toc:l};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"api"},"API"),Object(i.b)("h2",{id:"enable_unit"},Object(i.b)("inlineCode",{parentName:"h2"},"enable_unit")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"enable_unit(unit, target)")),Object(i.b)("p",null,"No docstring available."),Object(i.b)("h2",{id:"install_unit"},Object(i.b)("inlineCode",{parentName:"h2"},"install_unit")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"install_unit(source, dest, install_root)")),Object(i.b)("p",null,"No docstring available."),Object(i.b)("h2",{id:"mask_tmpfiles"},Object(i.b)("inlineCode",{parentName:"h2"},"mask_tmpfiles")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"mask_tmpfiles(configs)")),Object(i.b)("p",null,"No docstring available."),Object(i.b)("h2",{id:"mask_units"},Object(i.b)("inlineCode",{parentName:"h2"},"mask_units")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"mask_units(units)")),Object(i.b)("p",null,"No docstring available."),Object(i.b)("h2",{id:"set_default_target"},Object(i.b)("inlineCode",{parentName:"h2"},"set_default_target")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"set_default_target(target)")),Object(i.b)("p",null,"No docstring available."),Object(i.b)("h2",{id:"unmask_units"},Object(i.b)("inlineCode",{parentName:"h2"},"unmask_units")),Object(i.b)("p",null,"Prototype: ",Object(i.b)("inlineCode",{parentName:"p"},"unmask_units(units)")),Object(i.b)("p",null,"No docstring available."))}s.isMDXComponent=!0}}]);