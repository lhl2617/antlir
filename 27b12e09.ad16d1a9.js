(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{153:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return s}));var r=n(2),i=n(10),a=(n(0),n(182)),o={id:"installing",title:"Installation"},l={id:"installing",isDocsHomePage:!1,title:"Installation",description:"Dependencies",source:"@site/docs/installing.md",permalink:"/antlir/docs/installing",editUrl:"https://github.com/facebookincubator/antlir/edit/master/website/docs/installing.md",sidebar:"docs",previous:{title:"compiler/",permalink:"/antlir/docs/contributing/todos/compiler"}},c=[{value:"Dependencies",id:"dependencies",children:[{value:"Additional dependencies for re-bootstrapping",id:"additional-dependencies-for-re-bootstrapping",children:[]},{value:"Direnv",id:"direnv",children:[]}]},{value:"Fetch remote artifacts",id:"fetch-remote-artifacts",children:[]},{value:"Test your installation",id:"test-your-installation",children:[{value:"Troubleshooting",id:"troubleshooting",children:[]}]}],b={rightToc:c};function s(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"dependencies"},"Dependencies"),Object(a.b)("p",null,"Antlir has a relatively small set of dependencies required on the build host."),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"buck")," - Antlir bundles a script to download buck in ",Object(a.b)("inlineCode",{parentName:"li"},"tools/buck")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"java-11-openjdk")," - for ",Object(a.b)("inlineCode",{parentName:"li"},"buck")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"python3 >= 3.7")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"systemd-nspawn")," - usually provided by ",Object(a.b)("inlineCode",{parentName:"li"},"systemd")," or ",Object(a.b)("inlineCode",{parentName:"li"},"systemd-container")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"btrfs-progs")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"libcap-ng-devel")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"gcc")," or ",Object(a.b)("inlineCode",{parentName:"li"},"clang")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"https://facebook.github.io/watchman/docs/install.html"}),Object(a.b)("inlineCode",{parentName:"a"},"watchman"))," - optional but recommended for faster builds"),Object(a.b)("li",{parentName:"ul"},"a working ",Object(a.b)("inlineCode",{parentName:"li"},"cgroupv2")," setup (first introduced in the 4.5 kernel and already enabled on many modern distros)")),Object(a.b)("h3",{id:"additional-dependencies-for-re-bootstrapping"},"Additional dependencies for re-bootstrapping"),Object(a.b)("p",null,"This should rarely be required as the build appliance shipped with Antlir can\nrebuild itself. However, to rebuild the build appliance using only the host\nsystem, Antlir requires ",Object(a.b)("inlineCode",{parentName:"p"},"dnf")," and/or ",Object(a.b)("inlineCode",{parentName:"p"},"yum")," to be installed on the host."),Object(a.b)("h3",{id:"direnv"},"Direnv"),Object(a.b)("p",null,"Antlir comes with a ",Object(a.b)("inlineCode",{parentName:"p"},".envrc")," for use with ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://direnv.net/"}),Object(a.b)("inlineCode",{parentName:"a"},"direnv")),"\nthat makes some Antlir-related commands easier to use."),Object(a.b)("p",null,"Currently, it simply adds ",Object(a.b)("inlineCode",{parentName:"p"},"tools/")," to your ",Object(a.b)("inlineCode",{parentName:"p"},"$PATH")," when entering the\n",Object(a.b)("inlineCode",{parentName:"p"},"antlir/")," repo directory, which allows you to transparently use the copy of\n",Object(a.b)("inlineCode",{parentName:"p"},"buck")," that Antlir is distributed with. In the future this may be expanded to\noffer more aliases."),Object(a.b)("h2",{id:"fetch-remote-artifacts"},"Fetch remote artifacts"),Object(a.b)("p",null,"Antlir downloads some dependencies from the internet. It is advised to\ndownload these with ",Object(a.b)("inlineCode",{parentName:"p"},"buck")," before attempting to build any images:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"buck fetch //...\n")),Object(a.b)("h2",{id:"test-your-installation"},"Test your installation"),Object(a.b)("p",null,"A quick test to confirm that your environment is setup correctly:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"buck run //images/appliance:stable_build_appliance-container\n")),Object(a.b)("p",null,"This will give you a shell in the container that Antlir uses for container\nbuild operations. If this works you should be ready to build some images by\ngoing back to the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/antlir/docs/getting_started"}),"Getting Started")," page."),Object(a.b)("h3",{id:"troubleshooting"},"Troubleshooting"),Object(a.b)("h4",{id:"cgroupv2"},"cgroupv2"),Object(a.b)("p",null,"The most common case for the above failing is an issue with your host's\ncgroups setup.\nAntlir requires cgroupv2 to be enabled. Many recent distros already have\ncgroupv2 enabled, and others should have guides to do so.\nUsually this is just setting ",Object(a.b)("inlineCode",{parentName:"p"},"systemd.unified_cgroup_hierarchy=1")," on your\nkernel cmdline for ",Object(a.b)("inlineCode",{parentName:"p"},"systemd"),"-based systems so that ",Object(a.b)("inlineCode",{parentName:"p"},"systemd")," will mount\ncgroupv2 at ",Object(a.b)("inlineCode",{parentName:"p"},"/sys/fs/cgroup"),"."))}s.isMDXComponent=!0},182:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var b=i.a.createContext({}),s=function(e){var t=i.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=s(e.components);return i.a.createElement(b.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,b=c(e,["components","mdxType","originalType","parentName"]),d=s(n),u=r,m=d["".concat(o,".").concat(u)]||d[u]||p[u]||a;return n?i.a.createElement(m,l(l({ref:t},b),{},{components:n})):i.a.createElement(m,l({ref:t},b))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var b=2;b<a;b++)o[b]=n[b];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);