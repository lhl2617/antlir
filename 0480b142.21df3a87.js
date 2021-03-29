(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{107:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),p=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},b=function(e){var t=p(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),b=p(n),m=a,d=b["".concat(i,".").concat(m)]||b[m]||u[m]||o;return n?r.a.createElement(d,l(l({ref:t},s),{},{components:n})):r.a.createElement(d,l({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},65:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(3),r=n(7),o=(n(0),n(107)),i={id:"faq",title:"FAQ"},l={unversionedId:"faq",id:"faq",isDocsHomePage:!1,title:"FAQ",description:"General",source:"@site/docs/faq.md",slug:"/faq",permalink:"/antlir/docs/faq",editUrl:"https://github.com/facebookincubator/antlir/edit/master/website/docs/faq.md",version:"current",sidebar:"docs",previous:{title:"Getting Started",permalink:"/antlir/docs/getting_started"},next:{title:"Defining an Image",permalink:"/antlir/docs/tutorials/defining-an-image"}},c=[{value:"How do I inspect the contents of an <code>image.layer</code>?",id:"how-do-i-inspect-the-contents-of-an-imagelayer",children:[]},{value:"How do I inspect a packaged image?",id:"how-do-i-inspect-a-packaged-image",children:[]},{value:"RPMs",id:"rpms",children:[{value:"My RPM exists in the repos, but <code>image.rpms_install</code> fails to install it",id:"my-rpm-exists-in-the-repos-but-imagerpms_install-fails-to-install-it",children:[]},{value:"How do I inspect the RPM snapshot DB?",id:"how-do-i-inspect-the-rpm-snapshot-db",children:[]},{value:"How do I download RPMs from a particular snapshot?",id:"how-do-i-download-rpms-from-a-particular-snapshot",children:[]}]}],s={toc:c};function p(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"general"},"General"),Object(o.b)("h3",{id:"how-do-i-inspect-the-contents-of-an-imagelayer"},"How do I inspect the contents of an ",Object(o.b)("inlineCode",{parentName:"h3"},"image.layer"),"?"),Object(o.b)("p",null,"For a real OS image, just run ",Object(o.b)("inlineCode",{parentName:"p"},"buck run :LAYER-NAME-container"),"."),Object(o.b)("p",null,"For an image that lacks a shell, you can do something like this:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-py"}),'load("//antlir/bzl:constants.bzl", "REPO_CFG")\nload("//antlir/bzl:image.bzl", "image")\n\nimage.layer(name = "my-image", ...)\n\nimage.layer(\n  name = "inspect-my-image",\n  parent_layer = REPO_CFG.build_appliance_default,\n  features = [image.layer_mount(":my-image", "/my")]\n)\n')),Object(o.b)("p",null,"And then ",Object(o.b)("inlineCode",{parentName:"p"},"buck run :inspect-my-image-container"),"."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"DO NOT RELY ON THIS, this is subject to change without warning:")," In the\ncurrent implementation, you can find the layer's btrfs subvolume (but not\nits mounts) under ",Object(o.b)("inlineCode",{parentName:"p"},"buck-image-out/volume/targets/<layername>:NONCE/*/"),".\nThe second wildcard is the subvolume name, which defaults to ",Object(o.b)("inlineCode",{parentName:"p"},"volume"),".\nYou can find the full path by running:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),'buck run //antlir:find-built-subvol -- "$(\n  buck targets --show-full-output :your-layer | cut -d\\  -f2-\n)"\n')),Object(o.b)("h3",{id:"how-do-i-inspect-a-packaged-image"},"How do I inspect a packaged image?"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"For tarballs, use ",Object(o.b)("inlineCode",{parentName:"li"},"tar xf"),"."),Object(o.b)("li",{parentName:"ul"},"For Squashfs, either mount it, or ",Object(o.b)("inlineCode",{parentName:"li"},"unsquashfs"),"."),Object(o.b)("li",{parentName:"ul"},"For btrfs loopbacks, either mount it, or ",Object(o.b)("inlineCode",{parentName:"li"},"btrfs restore"),"."),Object(o.b)("li",{parentName:"ul"},"For btrfs sendstreams, here's how to receive and mount\n",Object(o.b)("inlineCode",{parentName:"li"},"image.sendstream.zst"),":",Object(o.b)("pre",{parentName:"li"},Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"truncate -s 100G image.btrfs\nmkfs.btrfs image.btrfs\nsudo unshare -m\nmkdir image\nmount image.btrfs image\ncd image\nzstd -cd ../image.sendstream.zst | btrfs receive .\nls  # To find the resulting subvolume directory\n")))),Object(o.b)("h2",{id:"rpms"},"RPMs"),Object(o.b)("h3",{id:"my-rpm-exists-in-the-repos-but-imagerpms_install-fails-to-install-it"},"My RPM exists in the repos, but ",Object(o.b)("inlineCode",{parentName:"h3"},"image.rpms_install")," fails to install it"),Object(o.b)("p",null,"Troubleshooting steps:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"Did you specify your RPM name correctly? Remember that ",Object(o.b)("inlineCode",{parentName:"p"},"foo-project")," is OK,\nbut ",Object(o.b)("inlineCode",{parentName:"p"},"foo-project-1.12")," is not supported. We will eventually support version\nlocking, but it will never use the RPM string syntax.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"#how-do-i-inspect-the-rpm-snapshot-db"}),"Inspect the repo snapshot")," and run\nthis SQL statement, replacing ",Object(o.b)("inlineCode",{parentName:"p"},"pv")," with your RPM name:"),Object(o.b)("pre",{parentName:"li"},Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-sql"}),'SELECT "repo", "path", "error", "error_json" FROM "rpm" WHERE "name" = "pv"\n')),Object(o.b)("p",{parentName:"li"},"If you get no rows, this means the RPM isn't actually in the snapshot.\nOr, you may see a non-empty error column, giving you a breadcrumb to\ndebug the snapshot itself."))),Object(o.b)("h3",{id:"how-do-i-inspect-the-rpm-snapshot-db"},"How do I inspect the RPM snapshot DB?"),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"(advanced)")," To look at the internals of the RPM snapshot DB, first find\nthe ",Object(o.b)("inlineCode",{parentName:"p"},"rpm_repo_snapshot")," target for your snapshot. If it is at ",Object(o.b)("inlineCode",{parentName:"p"},"//RPM:SNAP"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),'sqlite3 file:"$(readlink -f "$(\n   buck build //RPM:SNAP --show-full-output | cut -f 2 -d \' \'\n)")"/snapshot/snapshot.sql3?mode=ro``\n')),Object(o.b)("p",null,"From there, one can get stats on RPM errors via:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-sql"}),'SELECT "error", COUNT(1) FROM "rpm" WHERE "error" IS NOT NULL GROUP BY "error";\n')),Object(o.b)("p",null,'One could also see which versions of e.g. the "netperf" RPM are available with:'),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-sql"}),'SELECT * from "rpm" WHERE "name" IS "netperf";\n')),Object(o.b)("h3",{id:"how-do-i-download-rpms-from-a-particular-snapshot"},"How do I download RPMs from a particular snapshot?"),Object(o.b)("p",null,"First, you need a build appliance target path.  Grep the code for\n",Object(o.b)("inlineCode",{parentName:"p"},"build_appliance_default.*//")," to find the default one.  If its target path\nis ",Object(o.b)("inlineCode",{parentName:"p"},"//BUILD:APPLIANCE"),", and it uses ",Object(o.b)("inlineCode",{parentName:"p"},"dnf"),", then the following code will\nput any RPMs matching ",Object(o.b)("inlineCode",{parentName:"p"},"jq")," into your current directory:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"(set -o pipefail && buck run //BUILD:APPLIANCE-container \\\n  -- --user=root -- /bin/bash -uexc '\n    cd $(mktemp -d)\n    dnf download jq >&2\n    tar cf - .\n  ' | tar xf -)\n")),Object(o.b)("p",null,"For ",Object(o.b)("inlineCode",{parentName:"p"},"yum"),", this is a bit harder, since Antlir does not yet wrap ",Object(o.b)("inlineCode",{parentName:"p"},"yumdownloader"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"(set -o pipefail && buck run //BUILD:APPLIANCE-container \\\n  -- --user=root -- /bin/bash -uexc '\n    cd $(mktemp -d)\n    yumdownloader \\\n      --config \\\n      /__antlir__/rpm/default-snapshot-for-installer/yum/yum/etc/yum/yum.conf \\\n      jq >&2\n    tar cf - .\n  ' | tar xf -)\n")),Object(o.b)("p",null,"NB: We could get the easy ",Object(o.b)("inlineCode",{parentName:"p"},"dnf"),"-like behavior by aliasing ",Object(o.b)("inlineCode",{parentName:"p"},"yum download")," to\n",Object(o.b)("inlineCode",{parentName:"p"},"yumdownloader")," in our wrapper, if this proves to be a common use-case."))}p.isMDXComponent=!0}}]);