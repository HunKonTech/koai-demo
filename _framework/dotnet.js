//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var e=!1;const t=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),o=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),n=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),r=Symbol.for("wasm promise_control");function i(e,t){let o=null;const n=new Promise((function(n,r){o={isDone:!1,promise:null,resolve:t=>{o.isDone||(o.isDone=!0,n(t),e&&e())},reject:e=>{o.isDone||(o.isDone=!0,r(e),t&&t())}}}));o.promise=n;const i=n;return i[r]=o,{promise:i,promise_control:o}}function s(e){return e[r]}function a(e){e&&function(e){return void 0!==e[r]}(e)||Be(!1,"Promise is not controllable")}const l="__mono_message__",c=["debug","log","trace","warn","info","error"],d="MONO_WASM: ";let u,f,m,g,p,h;function w(e){g=e}function b(e){if(Pe.diagnosticTracing){const t="function"==typeof e?e():e;console.debug(d+t)}}function y(e,...t){console.info(d+e,...t)}function v(e,...t){console.info(e,...t)}function E(e,...t){console.warn(d+e,...t)}function _(e,...t){if(t&&t.length>0&&t[0]&&"object"==typeof t[0]){if(t[0].silent)return;if(t[0].toString)return void console.error(d+e,t[0].toString())}console.error(d+e,...t)}function x(e,t,o){return function(...n){try{let r=n[0];if(void 0===r)r="undefined";else if(null===r)r="null";else if("function"==typeof r)r=r.toString();else if("string"!=typeof r)try{r=JSON.stringify(r)}catch(e){r=r.toString()}t(o?JSON.stringify({method:e,payload:r,arguments:n.slice(1)}):[e+r,...n.slice(1)])}catch(e){m.error(`proxyConsole failed: ${e}`)}}}function j(e,t,o){f=t,g=e,m={...t};const n=`${o}/console`.replace("https://","wss://").replace("http://","ws://");u=new WebSocket(n),u.addEventListener("error",A),u.addEventListener("close",S),function(){for(const e of c)f[e]=x(`console.${e}`,T,!0)}()}function R(e){let t=30;const o=()=>{u?0==u.bufferedAmount||0==t?(e&&v(e),function(){for(const e of c)f[e]=x(`console.${e}`,m.log,!1)}(),u.removeEventListener("error",A),u.removeEventListener("close",S),u.close(1e3,e),u=void 0):(t--,globalThis.setTimeout(o,100)):e&&m&&m.log(e)};o()}function T(e){u&&u.readyState===WebSocket.OPEN?u.send(e):m.log(e)}function A(e){m.error(`[${g}] proxy console websocket error: ${e}`,e)}function S(e){m.debug(`[${g}] proxy console websocket closed: ${e}`,e)}function D(){Pe.preferredIcuAsset=O(Pe.config);let e="invariant"==Pe.config.globalizationMode;if(!e)if(Pe.preferredIcuAsset)Pe.diagnosticTracing&&b("ICU data archive(s) available, disabling invariant mode");else{if("custom"===Pe.config.globalizationMode||"all"===Pe.config.globalizationMode||"sharded"===Pe.config.globalizationMode){const e="invariant globalization mode is inactive and no ICU data archives are available";throw _(`ERROR: ${e}`),new Error(e)}Pe.diagnosticTracing&&b("ICU data archive(s) not available, using invariant globalization mode"),e=!0,Pe.preferredIcuAsset=null}const t="DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",o=Pe.config.environmentVariables;if(void 0===o[t]&&e&&(o[t]="1"),void 0===o.TZ)try{const e=Intl.DateTimeFormat().resolvedOptions().timeZone||null;e&&(o.TZ=e)}catch(e){y("failed to detect timezone, will fallback to UTC")}}function O(e){var t;if((null===(t=e.resources)||void 0===t?void 0:t.icu)&&"invariant"!=e.globalizationMode){const t=e.applicationCulture||(ke?globalThis.navigator&&globalThis.navigator.languages&&globalThis.navigator.languages[0]:Intl.DateTimeFormat().resolvedOptions().locale),o=e.resources.icu;let n=null;if("custom"===e.globalizationMode){if(o.length>=1)return o[0].name}else t&&"all"!==e.globalizationMode?"sharded"===e.globalizationMode&&(n=function(e){const t=e.split("-")[0];return"en"===t||["fr","fr-FR","it","it-IT","de","de-DE","es","es-ES"].includes(e)?"icudt_EFIGS.dat":["zh","ko","ja"].includes(t)?"icudt_CJK.dat":"icudt_no_CJK.dat"}(t)):n="icudt.dat";if(n)for(let e=0;e<o.length;e++){const t=o[e];if(t.virtualPath===n)return t.name}}return e.globalizationMode="invariant",null}(new Date).valueOf();const C=class{constructor(e){this.url=e}toString(){return this.url}};async function k(e,t){try{const o="function"==typeof globalThis.fetch;if(Se){const n=e.startsWith("file://");if(!n&&o)return globalThis.fetch(e,t||{credentials:"same-origin"});p||(h=Ne.require("url"),p=Ne.require("fs")),n&&(e=h.fileURLToPath(e));const r=await p.promises.readFile(e);return{ok:!0,headers:{length:0,get:()=>null},url:e,arrayBuffer:()=>r,json:()=>JSON.parse(r),text:()=>{throw new Error("NotImplementedException")}}}if(o)return globalThis.fetch(e,t||{credentials:"same-origin"});if("function"==typeof read)return{ok:!0,url:e,headers:{length:0,get:()=>null},arrayBuffer:()=>new Uint8Array(read(e,"binary")),json:()=>JSON.parse(read(e,"utf8")),text:()=>read(e,"utf8")}}catch(t){return{ok:!1,url:e,status:500,headers:{length:0,get:()=>null},statusText:"ERR28: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t},text:()=>{throw t}}}throw new Error("No fetch implementation available")}function I(e){return"string"!=typeof e&&Be(!1,"url must be a string"),!M(e)&&0!==e.indexOf("./")&&0!==e.indexOf("../")&&globalThis.URL&&globalThis.document&&globalThis.document.baseURI&&(e=new URL(e,globalThis.document.baseURI).toString()),e}const U=/^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,P=/[a-zA-Z]:[\\/]/;function M(e){return Se||Ie?e.startsWith("/")||e.startsWith("\\")||-1!==e.indexOf("///")||P.test(e):U.test(e)}let L,N=0;const $=[],z=[],W=new Map,F={"js-module-threads":!0,"js-module-runtime":!0,"js-module-dotnet":!0,"js-module-native":!0,"js-module-diagnostics":!0},B={...F,"js-module-library-initializer":!0},V={...F,dotnetwasm:!0,heap:!0,manifest:!0},q={...B,manifest:!0},H={...B,dotnetwasm:!0},J={dotnetwasm:!0,symbols:!0},Z={...B,dotnetwasm:!0,symbols:!0},Q={symbols:!0};function G(e){return!("icu"==e.behavior&&e.name!=Pe.preferredIcuAsset)}function K(e,t,o){null!=t||(t=[]),Be(1==t.length,`Expect to have one ${o} asset in resources`);const n=t[0];return n.behavior=o,X(n),e.push(n),n}function X(e){V[e.behavior]&&W.set(e.behavior,e)}function Y(e){Be(V[e],`Unknown single asset behavior ${e}`);const t=W.get(e);if(t&&!t.resolvedUrl)if(t.resolvedUrl=Pe.locateFile(t.name),F[t.behavior]){const e=ge(t);e?("string"!=typeof e&&Be(!1,"loadBootResource response for 'dotnetjs' type should be a URL string"),t.resolvedUrl=e):t.resolvedUrl=ce(t.resolvedUrl,t.behavior)}else if("dotnetwasm"!==t.behavior)throw new Error(`Unknown single asset behavior ${e}`);return t}function ee(e){const t=Y(e);return Be(t,`Single asset for ${e} not found`),t}let te=!1;async function oe(){if(!te){te=!0,Pe.diagnosticTracing&&b("mono_download_assets");try{const e=[],t=[],o=(e,t)=>{!Z[e.behavior]&&G(e)&&Pe.expected_instantiated_assets_count++,!H[e.behavior]&&G(e)&&(Pe.expected_downloaded_assets_count++,t.push(se(e)))};for(const t of $)o(t,e);for(const e of z)o(e,t);Pe.allDownloadsQueued.promise_control.resolve(),Promise.all([...e,...t]).then((()=>{Pe.allDownloadsFinished.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),await Pe.runtimeModuleLoaded.promise;const n=async e=>{const t=await e;if(t.buffer){if(!Z[t.behavior]){t.buffer&&"object"==typeof t.buffer||Be(!1,"asset buffer must be array-like or buffer-like or promise of these"),"string"!=typeof t.resolvedUrl&&Be(!1,"resolvedUrl must be string");const e=t.resolvedUrl,o=await t.buffer,n=new Uint8Array(o);pe(t),await Ue.beforeOnRuntimeInitialized.promise,Ue.instantiate_asset(t,e,n)}}else J[t.behavior]?("symbols"===t.behavior&&(await Ue.instantiate_symbols_asset(t),pe(t)),J[t.behavior]&&++Pe.actual_downloaded_assets_count):(t.isOptional||Be(!1,"Expected asset to have the downloaded buffer"),!H[t.behavior]&&G(t)&&Pe.expected_downloaded_assets_count--,!Z[t.behavior]&&G(t)&&Pe.expected_instantiated_assets_count--)},r=[],i=[];for(const t of e)r.push(n(t));for(const e of t)i.push(n(e));Promise.all(r).then((()=>{Ce||Ue.coreAssetsInMemory.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),Promise.all(i).then((async()=>{Ce||(await Ue.coreAssetsInMemory.promise,Ue.allAssetsInMemory.promise_control.resolve())})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e}))}catch(e){throw Pe.err("Error in mono_download_assets: "+e),e}}}let ne=!1;function re(){if(ne)return;ne=!0;const e=Pe.config,t=[];if(e.assets)for(const t of e.assets)"object"!=typeof t&&Be(!1,`asset must be object, it was ${typeof t} : ${t}`),"string"!=typeof t.behavior&&Be(!1,"asset behavior must be known string"),"string"!=typeof t.name&&Be(!1,"asset name must be string"),t.resolvedUrl&&"string"!=typeof t.resolvedUrl&&Be(!1,"asset resolvedUrl could be string"),t.hash&&"string"!=typeof t.hash&&Be(!1,"asset resolvedUrl could be string"),t.pendingDownload&&"object"!=typeof t.pendingDownload&&Be(!1,"asset pendingDownload could be object"),t.isCore?$.push(t):z.push(t),X(t);else if(e.resources){const o=e.resources;o.wasmNative||Be(!1,"resources.wasmNative must be defined"),o.jsModuleNative||Be(!1,"resources.jsModuleNative must be defined"),o.jsModuleRuntime||Be(!1,"resources.jsModuleRuntime must be defined"),K(z,o.wasmNative,"dotnetwasm"),K(t,o.jsModuleNative,"js-module-native"),K(t,o.jsModuleRuntime,"js-module-runtime"),o.jsModuleDiagnostics&&K(t,o.jsModuleDiagnostics,"js-module-diagnostics");const n=(e,t,o)=>{const n=e;n.behavior=t,o?(n.isCore=!0,$.push(n)):z.push(n)};if(o.coreAssembly)for(let e=0;e<o.coreAssembly.length;e++)n(o.coreAssembly[e],"assembly",!0);if(o.assembly)for(let e=0;e<o.assembly.length;e++)n(o.assembly[e],"assembly",!o.coreAssembly);if(0!=e.debugLevel&&Pe.isDebuggingSupported()){if(o.corePdb)for(let e=0;e<o.corePdb.length;e++)n(o.corePdb[e],"pdb",!0);if(o.pdb)for(let e=0;e<o.pdb.length;e++)n(o.pdb[e],"pdb",!o.corePdb)}if(e.loadAllSatelliteResources&&o.satelliteResources)for(const e in o.satelliteResources)for(let t=0;t<o.satelliteResources[e].length;t++){const r=o.satelliteResources[e][t];r.culture=e,n(r,"resource",!o.coreAssembly)}if(o.coreVfs)for(let e=0;e<o.coreVfs.length;e++)n(o.coreVfs[e],"vfs",!0);if(o.vfs)for(let e=0;e<o.vfs.length;e++)n(o.vfs[e],"vfs",!o.coreVfs);const r=O(e);if(r&&o.icu)for(let e=0;e<o.icu.length;e++){const t=o.icu[e];t.name===r&&n(t,"icu",!1)}if(o.wasmSymbols)for(let e=0;e<o.wasmSymbols.length;e++)n(o.wasmSymbols[e],"symbols",!1)}if(e.appsettings)for(let t=0;t<e.appsettings.length;t++){const o=e.appsettings[t],n=he(o);"appsettings.json"!==n&&n!==`appsettings.${e.applicationEnvironment}.json`||z.push({name:o,behavior:"vfs",cache:"no-cache",useCredentials:!0})}e.assets=[...$,...z,...t]}async function ie(e){const t=await se(e);return await t.pendingDownloadInternal.response,t.buffer}async function se(e){try{return await ae(e)}catch(t){if(!Pe.enableDownloadRetry)throw t;if(Ie||Se)throw t;if(e.pendingDownload&&e.pendingDownloadInternal==e.pendingDownload)throw t;if(e.resolvedUrl&&-1!=e.resolvedUrl.indexOf("file://"))throw t;if(t&&404==t.status)throw t;e.pendingDownloadInternal=void 0,await Pe.allDownloadsQueued.promise;try{return Pe.diagnosticTracing&&b(`Retrying download '${e.name}'`),await ae(e)}catch(t){return e.pendingDownloadInternal=void 0,await new Promise((e=>globalThis.setTimeout(e,100))),Pe.diagnosticTracing&&b(`Retrying download (2) '${e.name}' after delay`),await ae(e)}}}async function ae(e){for(;L;)await L.promise;try{++N,N==Pe.maxParallelDownloads&&(Pe.diagnosticTracing&&b("Throttling further parallel downloads"),L=i());const t=await async function(e){if(e.pendingDownload&&(e.pendingDownloadInternal=e.pendingDownload),e.pendingDownloadInternal&&e.pendingDownloadInternal.response)return e.pendingDownloadInternal.response;if(e.buffer){const t=await e.buffer;return e.resolvedUrl||(e.resolvedUrl="undefined://"+e.name),e.pendingDownloadInternal={url:e.resolvedUrl,name:e.name,response:Promise.resolve({ok:!0,arrayBuffer:()=>t,json:()=>JSON.parse(new TextDecoder("utf-8").decode(t)),text:()=>{throw new Error("NotImplementedException")},headers:{get:()=>{}}})},e.pendingDownloadInternal.response}const t=e.loadRemote&&Pe.config.remoteSources?Pe.config.remoteSources:[""];let o;for(let n of t){n=n.trim(),"./"===n&&(n="");const t=le(e,n);e.name===t?Pe.diagnosticTracing&&b(`Attempting to download '${t}'`):Pe.diagnosticTracing&&b(`Attempting to download '${t}' for ${e.name}`);try{e.resolvedUrl=t;const n=fe(e);if(e.pendingDownloadInternal=n,o=await n.response,!o||!o.ok)continue;return o}catch(e){o||(o={ok:!1,url:t,status:0,statusText:""+e});continue}}const n=e.isOptional||e.name.match(/\.pdb$/)&&Pe.config.ignorePdbLoadErrors;if(o||Be(!1,`Response undefined ${e.name}`),!n){const t=new Error(`download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`);throw t.status=o.status,t}y(`optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`)}(e);return t?(J[e.behavior]||(e.buffer=await t.arrayBuffer(),++Pe.actual_downloaded_assets_count),e):e}finally{if(--N,L&&N==Pe.maxParallelDownloads-1){Pe.diagnosticTracing&&b("Resuming more parallel downloads");const e=L;L=void 0,e.promise_control.resolve()}}}function le(e,t){let o;return null==t&&Be(!1,`sourcePrefix must be provided for ${e.name}`),e.resolvedUrl?o=e.resolvedUrl:(o=""===t?"assembly"===e.behavior||"pdb"===e.behavior?e.name:"resource"===e.behavior&&e.culture&&""!==e.culture?`${e.culture}/${e.name}`:e.name:t+e.name,o=ce(Pe.locateFile(o),e.behavior)),o&&"string"==typeof o||Be(!1,"attemptUrl need to be path or url string"),o}function ce(e,t){return Pe.modulesUniqueQuery&&q[t]&&(e+=Pe.modulesUniqueQuery),e}let de=0;const ue=new Set;function fe(e){try{e.resolvedUrl||Be(!1,"Request's resolvedUrl must be set");const t=function(e){let t=e.resolvedUrl;if(Pe.loadBootResource){const o=ge(e);if(o instanceof Promise)return o;"string"==typeof o&&(t=o)}const o={};return e.cache?o.cache=e.cache:Pe.config.disableNoCacheFetch||(o.cache="no-cache"),e.useCredentials?o.credentials="include":!Pe.config.disableIntegrityCheck&&e.hash&&(o.integrity=e.hash),Pe.fetch_like(t,o)}(e),o={name:e.name,url:e.resolvedUrl,response:t};return ue.add(e.name),o.response.then((()=>{"assembly"==e.behavior&&Pe.loadedAssemblies.push(e.name),de++,Pe.onDownloadResourceProgress&&Pe.onDownloadResourceProgress(de,ue.size)})),o}catch(t){const o={ok:!1,url:e.resolvedUrl,status:500,statusText:"ERR29: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t}};return{name:e.name,url:e.resolvedUrl,response:Promise.resolve(o)}}}const me={resource:"assembly",assembly:"assembly",pdb:"pdb",icu:"globalization",vfs:"configuration",manifest:"manifest",dotnetwasm:"dotnetwasm","js-module-dotnet":"dotnetjs","js-module-native":"dotnetjs","js-module-runtime":"dotnetjs","js-module-threads":"dotnetjs"};function ge(e){var t;if(Pe.loadBootResource){const o=null!==(t=e.hash)&&void 0!==t?t:"",n=e.resolvedUrl,r=me[e.behavior];if(r){const t=Pe.loadBootResource(r,e.name,n,o,e.behavior);return"string"==typeof t?I(t):t}}}function pe(e){e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null}function he(e){let t=e.lastIndexOf("/");return t>=0&&t++,e.substring(t)}async function we(e){e&&await Promise.all((null!=e?e:[]).map((e=>async function(e){try{const t=e.name;if(!e.moduleExports){const o=ce(Pe.locateFile(t),"js-module-library-initializer");Pe.diagnosticTracing&&b(`Attempting to import '${o}' for ${e}`),e.moduleExports=await import(/*! webpackIgnore: true */o)}Pe.libraryInitializers.push({scriptName:t,exports:e.moduleExports})}catch(t){E(`Failed to import library initializer '${e}': ${t}`)}}(e))))}async function be(e,t){if(!Pe.libraryInitializers)return;const o=[];for(let n=0;n<Pe.libraryInitializers.length;n++){const r=Pe.libraryInitializers[n];r.exports[e]&&o.push(ye(r.scriptName,e,(()=>r.exports[e](...t))))}await Promise.all(o)}async function ye(e,t,o){try{await o()}catch(o){throw E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),Xe(1,o),o}}function ve(e,t){if(e===t)return e;const o={...t};return void 0!==o.assets&&o.assets!==e.assets&&(o.assets=[...e.assets||[],...o.assets||[]]),void 0!==o.resources&&(o.resources=_e(e.resources||{assembly:[],jsModuleNative:[],jsModuleRuntime:[],wasmNative:[]},o.resources)),void 0!==o.environmentVariables&&(o.environmentVariables={...e.environmentVariables||{},...o.environmentVariables||{}}),void 0!==o.runtimeOptions&&o.runtimeOptions!==e.runtimeOptions&&(o.runtimeOptions=[...e.runtimeOptions||[],...o.runtimeOptions||[]]),Object.assign(e,o)}function Ee(e,t){if(e===t)return e;const o={...t};return o.config&&(e.config||(e.config={}),o.config=ve(e.config,o.config)),Object.assign(e,o)}function _e(e,t){if(e===t)return e;const o={...t};return void 0!==o.coreAssembly&&(o.coreAssembly=[...e.coreAssembly||[],...o.coreAssembly||[]]),void 0!==o.assembly&&(o.assembly=[...e.assembly||[],...o.assembly||[]]),void 0!==o.lazyAssembly&&(o.lazyAssembly=[...e.lazyAssembly||[],...o.lazyAssembly||[]]),void 0!==o.corePdb&&(o.corePdb=[...e.corePdb||[],...o.corePdb||[]]),void 0!==o.pdb&&(o.pdb=[...e.pdb||[],...o.pdb||[]]),void 0!==o.jsModuleWorker&&(o.jsModuleWorker=[...e.jsModuleWorker||[],...o.jsModuleWorker||[]]),void 0!==o.jsModuleNative&&(o.jsModuleNative=[...e.jsModuleNative||[],...o.jsModuleNative||[]]),void 0!==o.jsModuleDiagnostics&&(o.jsModuleDiagnostics=[...e.jsModuleDiagnostics||[],...o.jsModuleDiagnostics||[]]),void 0!==o.jsModuleRuntime&&(o.jsModuleRuntime=[...e.jsModuleRuntime||[],...o.jsModuleRuntime||[]]),void 0!==o.wasmSymbols&&(o.wasmSymbols=[...e.wasmSymbols||[],...o.wasmSymbols||[]]),void 0!==o.wasmNative&&(o.wasmNative=[...e.wasmNative||[],...o.wasmNative||[]]),void 0!==o.icu&&(o.icu=[...e.icu||[],...o.icu||[]]),void 0!==o.satelliteResources&&(o.satelliteResources=function(e,t){if(e===t)return e;for(const o in t)e[o]=[...e[o]||[],...t[o]||[]];return e}(e.satelliteResources||{},o.satelliteResources||{})),void 0!==o.modulesAfterConfigLoaded&&(o.modulesAfterConfigLoaded=[...e.modulesAfterConfigLoaded||[],...o.modulesAfterConfigLoaded||[]]),void 0!==o.modulesAfterRuntimeReady&&(o.modulesAfterRuntimeReady=[...e.modulesAfterRuntimeReady||[],...o.modulesAfterRuntimeReady||[]]),void 0!==o.extensions&&(o.extensions={...e.extensions||{},...o.extensions||{}}),void 0!==o.vfs&&(o.vfs=[...e.vfs||[],...o.vfs||[]]),Object.assign(e,o)}function xe(){const e=Pe.config;if(e.environmentVariables=e.environmentVariables||{},e.runtimeOptions=e.runtimeOptions||[],e.resources=e.resources||{assembly:[],jsModuleNative:[],jsModuleWorker:[],jsModuleRuntime:[],wasmNative:[],vfs:[],satelliteResources:{}},e.assets){Pe.diagnosticTracing&&b("config.assets is deprecated, use config.resources instead");for(const t of e.assets){const o={};switch(t.behavior){case"assembly":o.assembly=[t];break;case"pdb":o.pdb=[t];break;case"resource":o.satelliteResources={},o.satelliteResources[t.culture]=[t];break;case"icu":o.icu=[t];break;case"symbols":o.wasmSymbols=[t];break;case"vfs":o.vfs=[t];break;case"dotnetwasm":o.wasmNative=[t];break;case"js-module-threads":o.jsModuleWorker=[t];break;case"js-module-runtime":o.jsModuleRuntime=[t];break;case"js-module-native":o.jsModuleNative=[t];break;case"js-module-diagnostics":o.jsModuleDiagnostics=[t];break;case"js-module-dotnet":break;default:throw new Error(`Unexpected behavior ${t.behavior} of asset ${t.name}`)}_e(e.resources,o)}}e.debugLevel,e.applicationEnvironment||(e.applicationEnvironment="Production"),e.applicationCulture&&(e.environmentVariables.LANG=`${e.applicationCulture}.UTF-8`),Ue.diagnosticTracing=Pe.diagnosticTracing=!!e.diagnosticTracing,Ue.waitForDebugger=e.waitForDebugger,Pe.maxParallelDownloads=e.maxParallelDownloads||Pe.maxParallelDownloads,Pe.enableDownloadRetry=void 0!==e.enableDownloadRetry?e.enableDownloadRetry:Pe.enableDownloadRetry}let je=!1;async function Re(e){var t;if(je)return void await Pe.afterConfigLoaded.promise;let o;try{if(e.configSrc||Pe.config&&0!==Object.keys(Pe.config).length&&(Pe.config.assets||Pe.config.resources)||(e.configSrc="dotnet.boot.js"),o=e.configSrc,je=!0,o&&(Pe.diagnosticTracing&&b("mono_wasm_load_config"),await async function(e){const t=e.configSrc,o=Pe.locateFile(t);let n=null;void 0!==Pe.loadBootResource&&(n=Pe.loadBootResource("manifest",t,o,"","manifest"));let r,i=null;if(n)if("string"==typeof n)n.includes(".json")?(i=await s(I(n)),r=await Ae(i)):r=(await import(I(n))).config;else{const e=await n;"function"==typeof e.json?(i=e,r=await Ae(i)):r=e.config}else o.includes(".json")?(i=await s(ce(o,"manifest")),r=await Ae(i)):r=(await import(ce(o,"manifest"))).config;function s(e){return Pe.fetch_like(e,{method:"GET",credentials:"include",cache:"no-cache"})}Pe.config.applicationEnvironment&&(r.applicationEnvironment=Pe.config.applicationEnvironment),ve(Pe.config,r)}(e)),xe(),await we(null===(t=Pe.config.resources)||void 0===t?void 0:t.modulesAfterConfigLoaded),await be("onRuntimeConfigLoaded",[Pe.config]),e.onConfigLoaded)try{await e.onConfigLoaded(Pe.config,Le),xe()}catch(e){throw _("onConfigLoaded() failed",e),e}xe(),Pe.afterConfigLoaded.promise_control.resolve(Pe.config)}catch(t){const n=`Failed to load config file ${o} ${t} ${null==t?void 0:t.stack}`;throw Pe.config=e.config=Object.assign(Pe.config,{message:n,error:t,isError:!0}),Xe(1,new Error(n)),t}}function Te(){return!!globalThis.navigator&&(Pe.isChromium||Pe.isFirefox)}async function Ae(e){const t=Pe.config,o=await e.json();t.applicationEnvironment||o.applicationEnvironment||(o.applicationEnvironment=e.headers.get("Blazor-Environment")||e.headers.get("DotNet-Environment")||void 0),o.environmentVariables||(o.environmentVariables={});const n=e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");n&&(o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES=n);const r=e.headers.get("ASPNETCORE-BROWSER-TOOLS");return r&&(o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS=r),o}"function"!=typeof importScripts||globalThis.onmessage||(globalThis.dotnetSidecar=!0);const Se="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,De="function"==typeof importScripts,Oe=De&&"undefined"!=typeof dotnetSidecar,Ce=De&&!Oe,ke="object"==typeof window||De&&!Se,Ie=!ke&&!Se;let Ue={},Pe={},Me={},Le={},Ne={},$e=!1;const ze={},We={config:ze},Fe={mono:{},binding:{},internal:Ne,module:We,loaderHelpers:Pe,runtimeHelpers:Ue,diagnosticHelpers:Me,api:Le};function Be(e,t){if(e)return;const o="Assert failed: "+("function"==typeof t?t():t),n=new Error(o);_(o,n),Ue.nativeAbort(n)}function Ve(){return void 0!==Pe.exitCode}function qe(){return Ue.runtimeReady&&!Ve()}function He(){Ve()&&Be(!1,`.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`),Ue.runtimeReady||Be(!1,".NET runtime didn't start yet. Please call dotnet.create() first.")}function Je(){ke&&(globalThis.addEventListener("unhandledrejection",et),globalThis.addEventListener("error",tt))}let Ze,Qe;function Ge(e){Qe&&Qe(e),Xe(e,Pe.exitReason)}function Ke(e){Ze&&Ze(e||Pe.exitReason),Xe(1,e||Pe.exitReason)}function Xe(t,o){var n,r;const i=o&&"object"==typeof o;t=i&&"number"==typeof o.status?o.status:void 0===t?-1:t;const s=i&&"string"==typeof o.message?o.message:""+o;(o=i?o:Ue.ExitStatus?function(e,t){const o=new Ue.ExitStatus(e);return o.message=t,o.toString=()=>t,o}(t,s):new Error("Exit with code "+t+" "+s)).status=t,o.message||(o.message=s);const a=""+(o.stack||(new Error).stack);try{Object.defineProperty(o,"stack",{get:()=>a})}catch(e){}const l=!!o.silent;if(o.silent=!0,Ve())Pe.diagnosticTracing&&b("mono_exit called after exit");else{try{We.onAbort==Ke&&(We.onAbort=Ze),We.onExit==Ge&&(We.onExit=Qe),ke&&(globalThis.removeEventListener("unhandledrejection",et),globalThis.removeEventListener("error",tt)),Ue.runtimeReady?(Ue.jiterpreter_dump_stats&&Ue.jiterpreter_dump_stats(!1),0===t&&(null===(n=Pe.config)||void 0===n?void 0:n.interopCleanupOnExit)&&Ue.forceDisposeProxies(!0,!0),e&&0!==t&&(null===(r=Pe.config)||void 0===r||r.dumpThreadsOnNonZeroExit)):(Pe.diagnosticTracing&&b(`abort_startup, reason: ${o}`),function(e){Pe.allDownloadsQueued.promise_control.reject(e),Pe.allDownloadsFinished.promise_control.reject(e),Pe.afterConfigLoaded.promise_control.reject(e),Pe.wasmCompilePromise.promise_control.reject(e),Pe.runtimeModuleLoaded.promise_control.reject(e),Ue.dotnetReady&&(Ue.dotnetReady.promise_control.reject(e),Ue.afterInstantiateWasm.promise_control.reject(e),Ue.beforePreInit.promise_control.reject(e),Ue.afterPreInit.promise_control.reject(e),Ue.afterPreRun.promise_control.reject(e),Ue.beforeOnRuntimeInitialized.promise_control.reject(e),Ue.afterOnRuntimeInitialized.promise_control.reject(e),Ue.afterPostRun.promise_control.reject(e))}(o))}catch(e){E("mono_exit A failed",e)}try{l||(function(e,t){if(0!==e&&t){const e=Ue.ExitStatus&&t instanceof Ue.ExitStatus?b:_;"string"==typeof t?e(t):(void 0===t.stack&&(t.stack=(new Error).stack+""),t.message?e(Ue.stringify_as_error_with_stack?Ue.stringify_as_error_with_stack(t.message+"\n"+t.stack):t.message+"\n"+t.stack):e(JSON.stringify(t)))}!Ce&&Pe.config&&(Pe.config.logExitCode?Pe.config.forwardConsoleLogsToWS?R("WASM EXIT "+e):v("WASM EXIT "+e):Pe.config.forwardConsoleLogsToWS&&R())}(t,o),function(e){if(ke&&!Ce&&Pe.config&&Pe.config.appendElementOnExit&&document){const t=document.createElement("label");t.id="tests_done",0!==e&&(t.style.background="red"),t.innerHTML=""+e,document.body.appendChild(t)}}(t))}catch(e){E("mono_exit B failed",e)}Pe.exitCode=t,Pe.exitReason||(Pe.exitReason=o),!Ce&&Ue.runtimeReady&&We.runtimeKeepalivePop()}if(Pe.config&&Pe.config.asyncFlushOnExit&&0===t)throw(async()=>{try{await async function(){try{const e=await import(/*! webpackIgnore: true */"process"),t=e=>new Promise(((t,o)=>{e.on("error",o),e.end("","utf8",t)})),o=t(e.stderr),n=t(e.stdout);let r;const i=new Promise((e=>{r=setTimeout((()=>e("timeout")),1e3)}));await Promise.race([Promise.all([n,o]),i]),clearTimeout(r)}catch(e){_(`flushing std* streams failed: ${e}`)}}()}finally{Ye(t,o)}})(),o;Ye(t,o)}function Ye(e,t){if(Ue.runtimeReady&&Ue.nativeExit)try{Ue.nativeExit(e)}catch(e){!Ue.ExitStatus||e instanceof Ue.ExitStatus||E("set_exit_code_and_quit_now failed: "+e.toString())}if(0!==e||!ke)throw Se&&Ne.process?Ne.process.exit(e):Ue.quit&&Ue.quit(e,t),t}function et(e){ot(e,e.reason,"rejection")}function tt(e){ot(e,e.error,"error")}function ot(e,t,o){e.preventDefault();try{t||(t=new Error("Unhandled "+o)),void 0===t.stack&&(t.stack=(new Error).stack),t.stack=t.stack+"",t.silent||(_("Unhandled error:",t),Xe(1,t))}catch(e){}}!function(e){if($e)throw new Error("Loader module already loaded");$e=!0,Ue=e.runtimeHelpers,Pe=e.loaderHelpers,Me=e.diagnosticHelpers,Le=e.api,Ne=e.internal,Object.assign(Le,{INTERNAL:Ne,invokeLibraryInitializers:be}),Object.assign(e.module,{config:ve(ze,{environmentVariables:{}})});const r={mono_wasm_bindings_is_ready:!1,config:e.module.config,diagnosticTracing:!1,nativeAbort:e=>{throw e||new Error("abort")},nativeExit:e=>{throw new Error("exit:"+e)}},l={gitHash:"b16286c2284fecf303dbc12a0bb152476d662e44",config:e.module.config,diagnosticTracing:!1,maxParallelDownloads:16,enableDownloadRetry:!0,_loaded_files:[],loadedFiles:[],loadedAssemblies:[],libraryInitializers:[],workerNextNumber:1,actual_downloaded_assets_count:0,actual_instantiated_assets_count:0,expected_downloaded_assets_count:0,expected_instantiated_assets_count:0,afterConfigLoaded:i(),allDownloadsQueued:i(),allDownloadsFinished:i(),wasmCompilePromise:i(),runtimeModuleLoaded:i(),loadingWorkers:i(),is_exited:Ve,is_runtime_running:qe,assert_runtime_running:He,mono_exit:Xe,createPromiseController:i,getPromiseController:s,assertIsControllablePromise:a,mono_download_assets:oe,resolve_single_asset_path:ee,setup_proxy_console:j,set_thread_prefix:w,installUnhandledErrorHandler:Je,retrieve_asset_download:ie,invokeLibraryInitializers:be,isDebuggingSupported:Te,exceptions:t,simd:n,relaxedSimd:o};Object.assign(Ue,r),Object.assign(Pe,l)}(Fe);let nt,rt,it,st=!1,at=!1;async function lt(e){if(!at){if(at=!0,ke&&Pe.config.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&j("main",globalThis.console,globalThis.location.origin),We||Be(!1,"Null moduleConfig"),Pe.config||Be(!1,"Null moduleConfig.config"),"function"==typeof e){const t=e(Fe.api);if(t.ready)throw new Error("Module.ready couldn't be redefined.");Object.assign(We,t),Ee(We,t)}else{if("object"!=typeof e)throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");Ee(We,e)}await async function(e){if(Se){const e=await import(/*! webpackIgnore: true */"process"),t=14;if(e.versions.node.split(".")[0]<t)throw new Error(`NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`)}const t=/*! webpackIgnore: true */import.meta.url,o=t.indexOf("?");var n;if(o>0&&(Pe.modulesUniqueQuery=t.substring(o)),Pe.scriptUrl=t.replace(/\\/g,"/").replace(/[?#].*/,""),Pe.scriptDirectory=(n=Pe.scriptUrl).slice(0,n.lastIndexOf("/"))+"/",Pe.locateFile=e=>"URL"in globalThis&&globalThis.URL!==C?new URL(e,Pe.scriptDirectory).toString():M(e)?e:Pe.scriptDirectory+e,Pe.fetch_like=k,Pe.out=console.log,Pe.err=console.error,Pe.onDownloadResourceProgress=e.onDownloadResourceProgress,ke&&globalThis.navigator){const e=globalThis.navigator,t=e.userAgentData&&e.userAgentData.brands;t&&t.length>0?Pe.isChromium=t.some((e=>"Google Chrome"===e.brand||"Microsoft Edge"===e.brand||"Chromium"===e.brand)):e.userAgent&&(Pe.isChromium=e.userAgent.includes("Chrome"),Pe.isFirefox=e.userAgent.includes("Firefox"))}Ne.require=Se?await import(/*! webpackIgnore: true */"module").then((e=>e.createRequire(/*! webpackIgnore: true */import.meta.url))):Promise.resolve((()=>{throw new Error("require not supported")})),void 0===globalThis.URL&&(globalThis.URL=C)}(We)}}async function ct(e){return await lt(e),Ze=We.onAbort,Qe=We.onExit,We.onAbort=Ke,We.onExit=Ge,We.ENVIRONMENT_IS_PTHREAD?async function(){(function(){const e=new MessageChannel,t=e.port1,o=e.port2;t.addEventListener("message",(e=>{var n,r;n=JSON.parse(e.data.config),r=JSON.parse(e.data.monoThreadInfo),st?Pe.diagnosticTracing&&b("mono config already received"):(ve(Pe.config,n),Ue.monoThreadInfo=r,xe(),Pe.diagnosticTracing&&b("mono config received"),st=!0,Pe.afterConfigLoaded.promise_control.resolve(Pe.config),ke&&n.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&Pe.setup_proxy_console("worker-idle",console,globalThis.location.origin)),t.close(),o.close()}),{once:!0}),t.start(),self.postMessage({[l]:{monoCmd:"preload",port:o}},[o])})(),await Pe.afterConfigLoaded.promise,function(){const e=Pe.config;e.assets||Be(!1,"config.assets must be defined");for(const t of e.assets)X(t),Q[t.behavior]&&z.push(t)}(),setTimeout((async()=>{try{await oe()}catch(e){Xe(1,e)}}),0);const e=dt(),t=await Promise.all(e);return await ut(t),We}():async function(){var e;await Re(We),re();const t=dt();(async function(){try{const e=ee("dotnetwasm");await se(e),e&&e.pendingDownloadInternal&&e.pendingDownloadInternal.response||Be(!1,"Can't load dotnet.native.wasm");const t=await e.pendingDownloadInternal.response,o=t.headers&&t.headers.get?t.headers.get("Content-Type"):void 0;let n;if("function"==typeof WebAssembly.compileStreaming&&"application/wasm"===o)n=await WebAssembly.compileStreaming(t);else{ke&&"application/wasm"!==o&&E('WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.');const e=await t.arrayBuffer();Pe.diagnosticTracing&&b("instantiate_wasm_module buffered"),n=Ie?await Promise.resolve(new WebAssembly.Module(e)):await WebAssembly.compile(e)}e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null,Pe.wasmCompilePromise.promise_control.resolve(n)}catch(e){Pe.wasmCompilePromise.promise_control.reject(e)}})(),setTimeout((async()=>{try{D(),await oe()}catch(e){Xe(1,e)}}),0);const o=await Promise.all(t);return await ut(o),await Ue.dotnetReady.promise,await we(null===(e=Pe.config.resources)||void 0===e?void 0:e.modulesAfterRuntimeReady),await be("onRuntimeReady",[Fe.api]),Le}()}function dt(){const e=ee("js-module-runtime"),t=ee("js-module-native");if(nt&&rt)return[nt,rt,it];"object"==typeof e.moduleExports?nt=e.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),nt=import(/*! webpackIgnore: true */e.resolvedUrl)),"object"==typeof t.moduleExports?rt=t.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),rt=import(/*! webpackIgnore: true */t.resolvedUrl));const o=Y("js-module-diagnostics");return o&&("object"==typeof o.moduleExports?it=o.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),it=import(/*! webpackIgnore: true */o.resolvedUrl))),[nt,rt,it]}async function ut(e){const{initializeExports:t,initializeReplacements:o,configureRuntimeStartup:n,configureEmscriptenStartup:r,configureWorkerStartup:i,setRuntimeGlobals:s,passEmscriptenInternals:a}=e[0],{default:l}=e[1],c=e[2];s(Fe),t(Fe),c&&c.setRuntimeGlobals(Fe),await n(We),Pe.runtimeModuleLoaded.promise_control.resolve(),l((e=>(Object.assign(We,{ready:e.ready,__dotnet_runtime:{initializeReplacements:o,configureEmscriptenStartup:r,configureWorkerStartup:i,passEmscriptenInternals:a}}),We))).catch((e=>{if(e.message&&e.message.toLowerCase().includes("out of memory"))throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");throw e}))}const ft=new class{withModuleConfig(e){try{return Ee(We,e),this}catch(e){throw Xe(1,e),e}}withOnConfigLoaded(e){try{return Ee(We,{onConfigLoaded:e}),this}catch(e){throw Xe(1,e),e}}withConsoleForwarding(){try{return ve(ze,{forwardConsoleLogsToWS:!0}),this}catch(e){throw Xe(1,e),e}}withExitOnUnhandledError(){try{return ve(ze,{exitOnUnhandledError:!0}),Je(),this}catch(e){throw Xe(1,e),e}}withAsyncFlushOnExit(){try{return ve(ze,{asyncFlushOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withExitCodeLogging(){try{return ve(ze,{logExitCode:!0}),this}catch(e){throw Xe(1,e),e}}withElementOnExit(){try{return ve(ze,{appendElementOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withInteropCleanupOnExit(){try{return ve(ze,{interopCleanupOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withDumpThreadsOnNonZeroExit(){try{return ve(ze,{dumpThreadsOnNonZeroExit:!0}),this}catch(e){throw Xe(1,e),e}}withWaitingForDebugger(e){try{return ve(ze,{waitForDebugger:e}),this}catch(e){throw Xe(1,e),e}}withInterpreterPgo(e,t){try{return ve(ze,{interpreterPgo:e,interpreterPgoSaveDelay:t}),ze.runtimeOptions?ze.runtimeOptions.push("--interp-pgo-recording"):ze.runtimeOptions=["--interp-pgo-recording"],this}catch(e){throw Xe(1,e),e}}withConfig(e){try{return ve(ze,e),this}catch(e){throw Xe(1,e),e}}withConfigSrc(e){try{return e&&"string"==typeof e||Be(!1,"must be file path or URL"),Ee(We,{configSrc:e}),this}catch(e){throw Xe(1,e),e}}withVirtualWorkingDirectory(e){try{return e&&"string"==typeof e||Be(!1,"must be directory path"),ve(ze,{virtualWorkingDirectory:e}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariable(e,t){try{const o={};return o[e]=t,ve(ze,{environmentVariables:o}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariables(e){try{return e&&"object"==typeof e||Be(!1,"must be dictionary object"),ve(ze,{environmentVariables:e}),this}catch(e){throw Xe(1,e),e}}withDiagnosticTracing(e){try{return"boolean"!=typeof e&&Be(!1,"must be boolean"),ve(ze,{diagnosticTracing:e}),this}catch(e){throw Xe(1,e),e}}withDebugging(e){try{return null!=e&&"number"==typeof e||Be(!1,"must be number"),ve(ze,{debugLevel:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArguments(...e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ve(ze,{applicationArguments:e}),this}catch(e){throw Xe(1,e),e}}withRuntimeOptions(e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ze.runtimeOptions?ze.runtimeOptions.push(...e):ze.runtimeOptions=e,this}catch(e){throw Xe(1,e),e}}withMainAssembly(e){try{return ve(ze,{mainAssemblyName:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArgumentsFromQuery(){try{if(!globalThis.window)throw new Error("Missing window to the query parameters from");if(void 0===globalThis.URLSearchParams)throw new Error("URLSearchParams is supported");const e=new URLSearchParams(globalThis.window.location.search).getAll("arg");return this.withApplicationArguments(...e)}catch(e){throw Xe(1,e),e}}withApplicationEnvironment(e){try{return ve(ze,{applicationEnvironment:e}),this}catch(e){throw Xe(1,e),e}}withApplicationCulture(e){try{return ve(ze,{applicationCulture:e}),this}catch(e){throw Xe(1,e),e}}withResourceLoader(e){try{return Pe.loadBootResource=e,this}catch(e){throw Xe(1,e),e}}async download(){try{await async function(){lt(We),await Re(We),re(),D(),oe(),await Pe.allDownloadsFinished.promise}()}catch(e){throw Xe(1,e),e}}async create(){try{return this.instance||(this.instance=await async function(){return await ct(We),Fe.api}()),this.instance}catch(e){throw Xe(1,e),e}}async run(){try{return We.config||Be(!1,"Null moduleConfig.config"),this.instance||await this.create(),this.instance.runMainAndExit()}catch(e){throw Xe(1,e),e}}},mt=Xe,gt=ct;Ie||"function"==typeof globalThis.URL||Be(!1,"This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),"function"!=typeof globalThis.BigInt64Array&&Be(!1,"This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),ft.withConfig(/*json-start*/{
  "mainAssemblyName": "KOAI.Demo",
  "resources": {
    "hash": "sha256-4H4W6xE30w9F4fzeio5jwynSPxEbqqcWk+R4AFecME0=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.mx9wzm9o5h.js"
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.2zl32tp6ah.js"
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.imnhyiqpc9.wasm",
        "integrity": "sha256-2lvfACsds38yB7F9BvnIUtb0JBZIjimRTjlFpr4MLSw=",
        "cache": "force-cache"
      }
    ],
    "icu": [
      {
        "virtualPath": "icudt_CJK.dat",
        "name": "icudt_CJK.tjcz0u77k5.dat",
        "integrity": "sha256-SZLtQnRc0JkwqHab0VUVP7T3uBPSeYzxzDnpxPpUnHk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "icudt_EFIGS.dat",
        "name": "icudt_EFIGS.tptq2av103.dat",
        "integrity": "sha256-8fItetYY8kQ0ww6oxwTLiT3oXlBwHKumbeP2pRF4yTc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "icudt_no_CJK.dat",
        "name": "icudt_no_CJK.lfu7j35m59.dat",
        "integrity": "sha256-L7sV7NEYP37/Qr2FPCePo5cJqRgTXRwGHuwF5Q+0Nfs=",
        "cache": "force-cache"
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.gyxdr6jfrr.wasm",
        "integrity": "sha256-KLCoRog3BgtE86XT/xa443QSksWblYj+/3NCBRlwKuA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.4ci7r1aerr.wasm",
        "integrity": "sha256-lBf5W14SFx1JH3v/iL2tj4ornwJt5HKUa5tPRrov29Q=",
        "cache": "force-cache"
      }
    ],
    "assembly": [
      {
        "virtualPath": "AngleSharp.wasm",
        "name": "AngleSharp.2xweqkuwe8.wasm",
        "integrity": "sha256-JqgDW2+Uxx18Wfbxg3B4/0SE6HpMqd2M7FI3ys4AmQA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "CommunityToolkit.HighPerformance.wasm",
        "name": "CommunityToolkit.HighPerformance.gr8kze6y36.wasm",
        "integrity": "sha256-XER+gMR3R+QIXz00R/q4Q986utM3ZLpkLjfd7uFB054=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "CommunityToolkit.Mvvm.wasm",
        "name": "CommunityToolkit.Mvvm.mcmark5n5g.wasm",
        "integrity": "sha256-WpVXeBBhemrXNjLPPQ0nfsodRTDXcQ9yzBvLh6Tiq9w=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Markdig.wasm",
        "name": "Markdig.qqvxzo214f.wasm",
        "integrity": "sha256-Dh57L9nxu+ri9x4unzWqtqArq1FNLNpXHLdawKAE0i4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.wasm",
        "name": "Microsoft.AspNetCore.Components.qsfg9mrvz5.wasm",
        "integrity": "sha256-+uST9uP0LXUHHCRcO3owwEUahOifN6Xhxv2au35VNvs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.Web.wasm",
        "name": "Microsoft.AspNetCore.Components.Web.y500z77pfp.wasm",
        "integrity": "sha256-1i8MoXnfTx4dZMyBDynbTzoug8Ni/OGwHxvK8DyQ+BU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.WebAssembly.wasm",
        "name": "Microsoft.AspNetCore.Components.WebAssembly.yhmv00fjis.wasm",
        "integrity": "sha256-pjM5ZE/rIOtmfxJAH1TuPebIXMfMKQyvHDP4NLCWaCQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Bcl.AsyncInterfaces.wasm",
        "name": "Microsoft.Bcl.AsyncInterfaces.00slpjzdgf.wasm",
        "integrity": "sha256-ACqhr4oK47aSuMquzPyxoulRU5m0q5F6Q89hrlMlePs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.AI.Abstractions.wasm",
        "name": "Microsoft.Extensions.AI.Abstractions.8xlpb0v6f7.wasm",
        "integrity": "sha256-PJavWSzD3692BIe6pCheSfJv3mc/VutYfmvrwoZvYM4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.wasm",
        "name": "Microsoft.Extensions.Configuration.byt2r8jpbf.wasm",
        "integrity": "sha256-I4+EaVahm205fWtCCjHNu0JQkCoqkwXkA83p797yGAM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Abstractions.wasm",
        "name": "Microsoft.Extensions.Configuration.Abstractions.rvgls4fdhk.wasm",
        "integrity": "sha256-t6RTssXXLKtSJOUT6iI/BYV3YrPbautTCsqhz549lCU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Json.wasm",
        "name": "Microsoft.Extensions.Configuration.Json.vejc7kiu4g.wasm",
        "integrity": "sha256-R8Rvf+ufvlMX05PSWGUXwGm3hty6uCI9EtqBH2FpDIQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.7kgrfhq7r7.wasm",
        "integrity": "sha256-acCED8dRnvLNnWqy3QvjvLCIeDKOBEuD3A120wuHhr4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.Abstractions.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.Abstractions.u782hby6fs.wasm",
        "integrity": "sha256-5gwxa4X7UTempeTmGrudXDM7IwvvS28gRbrHkOW6tWw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Diagnostics.wasm",
        "name": "Microsoft.Extensions.Diagnostics.kn55k4hw0k.wasm",
        "integrity": "sha256-ICAZXkfsV47AvBAk4s7B/v8XECziz5pxTspr/3wAm+Y=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Diagnostics.Abstractions.wasm",
        "name": "Microsoft.Extensions.Diagnostics.Abstractions.aq4efrgfvw.wasm",
        "integrity": "sha256-jnUANINJX5ej9QFMDcnAYzmPZRJelDzKgzNrIPzaZBo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Http.wasm",
        "name": "Microsoft.Extensions.Http.a4jmv1xxno.wasm",
        "integrity": "sha256-toJMOHDBgTrDrPZjr47onXl6q6wFZaCYKYKkGryfO4U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.wasm",
        "name": "Microsoft.Extensions.Logging.ger56xfdhs.wasm",
        "integrity": "sha256-+DPJne1or8wZGGXbN7QpHpeJLGLp6ihi1Kb++VzIaVI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.Abstractions.wasm",
        "name": "Microsoft.Extensions.Logging.Abstractions.qyr20temk7.wasm",
        "integrity": "sha256-7hFNgSTLMjvSr7/ceu++AB6pbVBSVZ+9lf2ZTbZTQkA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Options.wasm",
        "name": "Microsoft.Extensions.Options.ncwljqhb3i.wasm",
        "integrity": "sha256-BwLDmBXrFXkfUdn7sVo9YyoOSQFX+143Svv2OhmmYmA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Primitives.wasm",
        "name": "Microsoft.Extensions.Primitives.eewmw9d15l.wasm",
        "integrity": "sha256-er4A1+W71s2J3Zr8PuCJcmcgVzc74xHt4iIulE9gUeA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.wasm",
        "name": "Microsoft.JSInterop.g6525v9sh4.wasm",
        "integrity": "sha256-uBej9yObp7RZ42uHyGNKoQjtthWvtEJFz8B2gEdD6F4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.WebAssembly.wasm",
        "name": "Microsoft.JSInterop.WebAssembly.nsfh695mwg.wasm",
        "integrity": "sha256-N8RKL2Eil4ZFxIkWa6Uig12+nRHOstda562q7GCs9fE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Playwright.wasm",
        "name": "Microsoft.Playwright.n1o7roi69b.wasm",
        "integrity": "sha256-hY/tbKs0u2mr7SgIqCV/qa/1N6PTlbuGyimzex3RTSg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SmartReader.wasm",
        "name": "SmartReader.1dgg7jvemr.wasm",
        "integrity": "sha256-1bkFgRoZv9AM6Hyck+yCEQeHQxIndesjdW9aVw1XmIo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SQLite-net.wasm",
        "name": "SQLite-net.qnp0uf7rlg.wasm",
        "integrity": "sha256-5iuwUKJEojwOa21/nJQZyEmGZuKtPBb87+brDxcqVqg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SQLitePCLRaw.core.wasm",
        "name": "SQLitePCLRaw.core.mvz7zlku01.wasm",
        "integrity": "sha256-nhftByjSLKSn2xGY8gIGZ7uyHG8WAEHjwQ5nzOEmm9k=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SQLitePCLRaw.provider.e_sqlite3.wasm",
        "name": "SQLitePCLRaw.provider.e_sqlite3.x3al2forqt.wasm",
        "integrity": "sha256-k7tF/kArx+XbIhnXj3jZJkKWejTShHUjd991yxukeFw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Interactive.Async.wasm",
        "name": "System.Interactive.Async.w4ccatvl43.wasm",
        "integrity": "sha256-kCn05pitMJb4HeHW8//LYoOnmmVre2ARo/2fCjaKzd4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.Async.wasm",
        "name": "System.Linq.Async.9ng5pnnqa8.wasm",
        "integrity": "sha256-e7f/b+XuYlL7gnMn3ZSLldZLWLhnjmjnS9e/lc9nFhI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Numerics.Tensors.wasm",
        "name": "System.Numerics.Tensors.xx9fo4fsg0.wasm",
        "integrity": "sha256-FXidmRF26TsQnNdB79tXp6d6SUXOlA8LdCutZvCYCug=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Win32.Primitives.wasm",
        "name": "Microsoft.Win32.Primitives.2b65cfehbv.wasm",
        "integrity": "sha256-Lvei+zaKuFk6ilL3SFgynjXaNunGiCAKGLiwiCVSZmo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.qyes113rfs.wasm",
        "integrity": "sha256-wm+1agAppghBEYQOzkhLAknsqn7WgFlRjrsxZ2AtIbo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Immutable.wasm",
        "name": "System.Collections.Immutable.ib3npzsohc.wasm",
        "integrity": "sha256-jlUSgTA7kzkRH32pDZyoXpQyUKo3HnLsiWNTULCsbaA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.NonGeneric.wasm",
        "name": "System.Collections.NonGeneric.tuobwltg5d.wasm",
        "integrity": "sha256-a0miA4SyMrTaqUf4BHWJsvtFp152mpkBoww0NyFieFI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Specialized.wasm",
        "name": "System.Collections.Specialized.q2jwkap578.wasm",
        "integrity": "sha256-kvTYc3hYW1VkuQkhn9Mpsg2B59LmntvkiHAHOAj1lYM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.wasm",
        "name": "System.Collections.qfqqtp4fq1.wasm",
        "integrity": "sha256-qrZbkwG2onWTFt6uHQa/+X+F2e5i3vpDuLEqhWATgKg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.Annotations.wasm",
        "name": "System.ComponentModel.Annotations.haq5imp9qy.wasm",
        "integrity": "sha256-WU7W8TpjvopoONXRqoPypkeFW8OKSuodwIXVHoBaDKw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.wasm",
        "name": "System.ComponentModel.Primitives.r27qem1r9j.wasm",
        "integrity": "sha256-raOXCXpiU9y2GyVZvCrv3pJLTM6IcVksgECyNiXX2II=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.wasm",
        "name": "System.ComponentModel.TypeConverter.vlsoam1wat.wasm",
        "integrity": "sha256-0xihccVu9stNgUAZwYmClLmzHHrrSd6sgyjXUzaHbJU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.wasm",
        "name": "System.ComponentModel.xmxjt0ntly.wasm",
        "integrity": "sha256-CR76GIDDw1MfCthwQyrZZq4JBsRxEB1vPmliVD9HL4U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Console.wasm",
        "name": "System.Console.hhuljkt1ly.wasm",
        "integrity": "sha256-a5/UU34DUhLco1yHuuny+i6CYhb7cwnCE3jTmPEnP+I=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.DiagnosticSource.wasm",
        "name": "System.Diagnostics.DiagnosticSource.7rf9fzaqy3.wasm",
        "integrity": "sha256-/Ux9YJWexEWZ7FrGSttrnbedwDLQEI0GF9wz9vRz7tY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.FileVersionInfo.wasm",
        "name": "System.Diagnostics.FileVersionInfo.3ukys5ru61.wasm",
        "integrity": "sha256-BWKokrktMH6h+cEwvN9edF4Yo8Rpwxw6ncfnZB3tm8E=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.Process.wasm",
        "name": "System.Diagnostics.Process.fstodbqk30.wasm",
        "integrity": "sha256-MXo0f9zjAUfyFA5UI+x9i75Y+BBDBa4Yw1J4evmLVQc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.TraceSource.wasm",
        "name": "System.Diagnostics.TraceSource.tomsf3iiui.wasm",
        "integrity": "sha256-I6MVlKGLdgTOwn7LkdOBb5Iy6MSCV805Cgn2na/mMMI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Formats.Tar.wasm",
        "name": "System.Formats.Tar.9hdspasd56.wasm",
        "integrity": "sha256-PVSLutLNz94zKg/qFwYz3sAVx0lhS1KUZ/7ZEugjQTA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Compression.ZipFile.wasm",
        "name": "System.IO.Compression.ZipFile.6e32ipbqyb.wasm",
        "integrity": "sha256-rgNvF9ZyfuZekUSkmLxyD3WERDatVeNLzOQbsLIMicw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Compression.wasm",
        "name": "System.IO.Compression.896zp7xdvq.wasm",
        "integrity": "sha256-bI/lQmoMA3ZXPdIW/czZGqrdBxv6ozoXWaiD3Ic4ZDc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.MemoryMappedFiles.wasm",
        "name": "System.IO.MemoryMappedFiles.jw8j12rj38.wasm",
        "integrity": "sha256-LfOavgv+A3j8rImq/Qulkk1HnJ9W9czMA6RQ886F7TE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.pwfw0zwx98.wasm",
        "integrity": "sha256-icS8WxKQ4KAWcutc7rR8xAIOabkTt6riZJOoYooT3/k=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.AsyncEnumerable.wasm",
        "name": "System.Linq.AsyncEnumerable.hstfs77ysb.wasm",
        "integrity": "sha256-b7OW/KYST/nxhO4JshrnbcBGuVkTHFkYmXLhZrXdavQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.Expressions.wasm",
        "name": "System.Linq.Expressions.66m3ii9lrp.wasm",
        "integrity": "sha256-AsM+MhB7iyyiYQQs3wAJ4v0zM3BGRmdGYUF65W6WgGk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.wasm",
        "name": "System.Linq.0rvk1wn6tx.wasm",
        "integrity": "sha256-vO4N+ao7UIkegw7z3ey3WaNs6hhuYgyAonxf6Ug4Ics=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.uo3mozilut.wasm",
        "integrity": "sha256-0l8IT92uwqShfEi6zRzsPZR+V7C3wD6z5tW2G/3+c8Y=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Http.Json.wasm",
        "name": "System.Net.Http.Json.af3rywqu80.wasm",
        "integrity": "sha256-6rNVEbURDeLUkLBSj+20WoHqnsI1EOVTAkekCXagnp4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Http.wasm",
        "name": "System.Net.Http.wvakeqiqqm.wasm",
        "integrity": "sha256-5HUCHep3UvHnAtGdLPMkRm0X01cA/HdcPMZQNHdtEFQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.HttpListener.wasm",
        "name": "System.Net.HttpListener.1qrzg4kwt7.wasm",
        "integrity": "sha256-GVfs4nlgxoxmI5gmy5wfbouQoGkuFQXUV5QvStEFlSc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.NameResolution.wasm",
        "name": "System.Net.NameResolution.hbamhvcvtt.wasm",
        "integrity": "sha256-vep89Fi4tlcIUF9cd1jL9/q7ADy5AFoylQJJNrsqBfc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.NetworkInformation.wasm",
        "name": "System.Net.NetworkInformation.po3aeli952.wasm",
        "integrity": "sha256-1yzmA2kjlHDIrEQxUdLd7nID7q0B5V9erQd+9EVjpD4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Primitives.wasm",
        "name": "System.Net.Primitives.arczer9gnz.wasm",
        "integrity": "sha256-VtV9FzDQOdA+67g6nIBGTAEJ14f8aNpUurZ7WmM7TCc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Requests.wasm",
        "name": "System.Net.Requests.iikae753bs.wasm",
        "integrity": "sha256-WuDpfIaXeHU6LMB4/Xbpksq9b6QeGCWXFE65KvCNXRs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Security.wasm",
        "name": "System.Net.Security.awgxv874rd.wasm",
        "integrity": "sha256-Nh3HatKLq9uIhRAPGrMjjcQFHLhkZG82eQh+o+dKC+w=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Sockets.wasm",
        "name": "System.Net.Sockets.towf5tp0wo.wasm",
        "integrity": "sha256-w2N3r879nB6P3Ghui2WqWvBKULnuTHQ38a+avUachxU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.WebHeaderCollection.wasm",
        "name": "System.Net.WebHeaderCollection.dqvyfpkch8.wasm",
        "integrity": "sha256-23eTwdJzQyjDT2eE9v/kHgLPW/gYqcLV+JwIGpy6490=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.WebSockets.Client.wasm",
        "name": "System.Net.WebSockets.Client.lovkwidhi6.wasm",
        "integrity": "sha256-m2pdEAJZpoPa32Zt7ZWtGlESx+wz6sqfLm6YqBxmwBU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.WebSockets.wasm",
        "name": "System.Net.WebSockets.j6mcdrk6f3.wasm",
        "integrity": "sha256-tcu8kwxvkUDdowbuO1EGMLW38aBR9hdPSTVK6U6OmRs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ObjectModel.wasm",
        "name": "System.ObjectModel.q7izguwyel.wasm",
        "integrity": "sha256-9g5Lf1E/Adpx0qOqZDH41kyxtAr/NLFhFKhYohy2xo4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Uri.wasm",
        "name": "System.Private.Uri.epbwop5d16.wasm",
        "integrity": "sha256-vlB6DQV0u6H06Dr5sXU7Ec9bucJXPpC1ebW5nN9lfEU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.Linq.wasm",
        "name": "System.Private.Xml.Linq.g5mkl7e2n6.wasm",
        "integrity": "sha256-3EHu3Li7EAfJgGtqk0hYux1+yjlw2itRdIiF/vz5U88=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.wasm",
        "name": "System.Private.Xml.67mrm13qh7.wasm",
        "integrity": "sha256-ItN+s4LLJJBTf34OCSF26RcA8LcqMIeGEA0EnugEOIs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.InteropServices.wasm",
        "name": "System.Runtime.InteropServices.p8ek6cuzhl.wasm",
        "integrity": "sha256-52RcpTcveV3IuDh2ue6TdF8OWvIKmxlZAbT+B3mpCCQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Intrinsics.wasm",
        "name": "System.Runtime.Intrinsics.r1cocthc3z.wasm",
        "integrity": "sha256-AX08XmtBtNHA9uyMDM1Wp8QNnUGze7vCXeQ+XuLjXlk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Numerics.wasm",
        "name": "System.Runtime.Numerics.fgu0kxa3w6.wasm",
        "integrity": "sha256-L7KJRVrDlBhUMCC1MHrOXZ+7amYJOg83B+L2N1OLsSA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Serialization.Formatters.wasm",
        "name": "System.Runtime.Serialization.Formatters.70x954t29w.wasm",
        "integrity": "sha256-qetj746mvAK2bCnhkn28iKHF4I8rmqKikN2Y/eUUaaE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Serialization.Primitives.wasm",
        "name": "System.Runtime.Serialization.Primitives.jb61e55me0.wasm",
        "integrity": "sha256-P6ifOV6s9hY3e7LL1i9rppBzWVsJyrIn69hQ5Z8mA3E=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.wasm",
        "name": "System.Runtime.v6fz5xmfjx.wasm",
        "integrity": "sha256-WV//XhFDyzr02KD8ZdWlKVOgFA14vSOvgDm+JC7BbO0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Security.Cryptography.wasm",
        "name": "System.Security.Cryptography.ptnmqwmcbm.wasm",
        "integrity": "sha256-HVx4TSW2xJcyXSWTHkjOKxYer+8Nu7iJ0nsYfLzqhEs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.CodePages.wasm",
        "name": "System.Text.Encoding.CodePages.h0fgfmy54b.wasm",
        "integrity": "sha256-/2iiRZJO2XKNv7bPCZ2sdR/LbA+V3/45STS1k5tF+DU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.Extensions.wasm",
        "name": "System.Text.Encoding.Extensions.hfjgrokrsc.wasm",
        "integrity": "sha256-XSFpMSl3/sESF81y0k7c1PN+q4p9iJQJ585RLYWXBUU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.ivz1pjkwyn.wasm",
        "integrity": "sha256-Im9wZMzxTpy6kB/lv1Y1CflEbmU6k/KU41FgCEG4y7E=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.4pvjeew7c8.wasm",
        "integrity": "sha256-OK2LFw1ein91zNBgdN/5wK6BKhVLqendoeAVg06+pXo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.RegularExpressions.wasm",
        "name": "System.Text.RegularExpressions.osdxy6o67z.wasm",
        "integrity": "sha256-6AH/2jMyAtzcjbKrkVouhGacf7TITlO7qSctv1G5H+s=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Channels.wasm",
        "name": "System.Threading.Channels.uz1favd976.wasm",
        "integrity": "sha256-2u3HbrTG3glw33Dk3li9ksuHda9efpwBcwan+kaabDA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Tasks.Extensions.wasm",
        "name": "System.Threading.Tasks.Extensions.rusbfg4d7u.wasm",
        "integrity": "sha256-LWpoifZ+aICdedsb1XPBu/WDmS4Wl0Xu7jT9/IfWn40=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Thread.wasm",
        "name": "System.Threading.Thread.x3pq94fw8i.wasm",
        "integrity": "sha256-nSp+pvvWFMF5eUI2N0wrlDbLNIkSWfTP/hMJrdXoZJo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.wasm",
        "name": "System.Threading.7t4px8hswa.wasm",
        "integrity": "sha256-m9VbTBUo75AhGhFkzI6dgxlxkYFIgRAWE0kNh1GNqOE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Web.HttpUtility.wasm",
        "name": "System.Web.HttpUtility.secx9gmj8c.wasm",
        "integrity": "sha256-7DlFmzscJ4ezOsLhiRvnN6DurSeACYBYcZns/1YsKIk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.Linq.wasm",
        "name": "System.Xml.Linq.1t1f7abjkk.wasm",
        "integrity": "sha256-5fWQqFGllSkAU/RIKtlSWTiQ6yo6HqKLGnlWX4e/sPk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.ReaderWriter.wasm",
        "name": "System.Xml.ReaderWriter.qnyc0aon7f.wasm",
        "integrity": "sha256-ih2INnCpBGq7gS2FmWqWKXGrWso4KjFC4Zn8BthLSfE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XDocument.wasm",
        "name": "System.Xml.XDocument.602vgd1cji.wasm",
        "integrity": "sha256-5o/fXRjZRaVLg5DjyUKIljfEwoZLZTo3Wq2mOsMAI0k=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.wasm",
        "name": "System.0x1wb7tfot.wasm",
        "integrity": "sha256-tMixsUF4GSgbd7+FHB6PICB4tUpDj29znyKxTr6gLUA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "netstandard.wasm",
        "name": "netstandard.5r1neuo22j.wasm",
        "integrity": "sha256-oW6a1FllTx4+lzzVgroo71D48AROE9m9rr7k7jX9BdU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "KOAI.Core.wasm",
        "name": "KOAI.Core.qnirr0d1c3.wasm",
        "integrity": "sha256-NqJhSvrCT613Q30x+hnW5kXjTrYNGeUJkvtydHFUNW4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "KOAI.Llama.wasm",
        "name": "KOAI.Llama.luonc5himg.wasm",
        "integrity": "sha256-jS3A+IoM9vo80hGsnZhxwBSTYXWDjz5WvkuOOxbYnvk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "KOAI.Relay.Contracts.wasm",
        "name": "KOAI.Relay.Contracts.9r2pd653tr.wasm",
        "integrity": "sha256-Ne9tROrT8TU6wjCcfXWavbAIACAuEIiuulZKpHqLpgk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "KOAI.Shared.wasm",
        "name": "KOAI.Shared.5nf0v3izlr.wasm",
        "integrity": "sha256-z2XC2PKjdWvdg+szQbHHAF1O+8s/XXmLxv6mTP/z6vQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "LLamaSharp.wasm",
        "name": "LLamaSharp.8jxcubyh22.wasm",
        "integrity": "sha256-xH6bKnJGV6l16hdYfsDcxNVaLN7KuTppCCm889v3nkY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "KOAI.Demo.wasm",
        "name": "KOAI.Demo.2u2npoykfi.wasm",
        "integrity": "sha256-5lhrMICD8runt0F9omiZaEA1KaK1Y9H8chigtNowTas=",
        "cache": "force-cache"
      }
    ],
    "satelliteResources": {
      "af": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.b9aheb5y7h.wasm",
          "integrity": "sha256-L/jCzyCaqn9lXJge35JCZlrrWADM0dkJnVWd4ybbzpg=",
          "cache": "force-cache"
        }
      ],
      "am": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.qeh2fspvs0.wasm",
          "integrity": "sha256-Xox1IV14OobgeHcllgJ7sEzx58c3B+JZbAjlI3SLCXc=",
          "cache": "force-cache"
        }
      ],
      "ar": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ok6pvl9qhu.wasm",
          "integrity": "sha256-iPBewQNsawVxHFo6W2T1hYkIzZUSQ6X/DMvJjdQL8w8=",
          "cache": "force-cache"
        }
      ],
      "az": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.uwusudsbnf.wasm",
          "integrity": "sha256-fj3lfKM6IcQARyIvSMoo2eYt0qJTqEfOaTj4gtxj9n8=",
          "cache": "force-cache"
        }
      ],
      "be": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.o944kywc4z.wasm",
          "integrity": "sha256-nEoqetnp8SkdaWG8yIyjU78ziuejfxu2aFnwXvQyzDw=",
          "cache": "force-cache"
        }
      ],
      "bg": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.jhj23wpgln.wasm",
          "integrity": "sha256-2T0fKWntBqWCQqHVnckhi/MNCc0pTXzGf9spWBAZge8=",
          "cache": "force-cache"
        }
      ],
      "bn": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.87yy7zj74j.wasm",
          "integrity": "sha256-pKQyi9NBmfQPkrrJYLC7GB318fUH5/8NuBgVE9q1m/E=",
          "cache": "force-cache"
        }
      ],
      "bs": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.r9s0k4thdq.wasm",
          "integrity": "sha256-H8P3oCRewyVtwbbG+do0wipuqCD7i7t4NG2Jf8cHke4=",
          "cache": "force-cache"
        }
      ],
      "cs": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.gi92dnq7ri.wasm",
          "integrity": "sha256-WBp+oUMc0hHn9gnZs8KlQaKCayOzS6Wt96mupIEc9eA=",
          "cache": "force-cache"
        }
      ],
      "da": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.1zyj8076ay.wasm",
          "integrity": "sha256-zS8c1R/LUyoZ7bvbFc2Xh8ifkKxOM6c823WqBfpkuvo=",
          "cache": "force-cache"
        }
      ],
      "de": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.as47ay5s99.wasm",
          "integrity": "sha256-BopZohT4wxuTKdMUyw28MRJQ7F5+95O/Zf6CgloU2+o=",
          "cache": "force-cache"
        }
      ],
      "el": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.n2qc6plj1g.wasm",
          "integrity": "sha256-ARfHHAXO8SW6wCy6R+wYsR/pTM5ZazGgvR3HoaoBmjM=",
          "cache": "force-cache"
        }
      ],
      "es": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ccexwd9bf9.wasm",
          "integrity": "sha256-3IqtFRbjb2p6WnWnU/O+qMOEumVX26Mo9r/briAIai4=",
          "cache": "force-cache"
        }
      ],
      "et": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.n55ulq3l2r.wasm",
          "integrity": "sha256-ZT0FBhVbK2j+fNW2pMzEcs30+iq86rZEDQkSba+h+AE=",
          "cache": "force-cache"
        }
      ],
      "fa": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.v28uxbo06w.wasm",
          "integrity": "sha256-mS7o8llOE26Ezp9z4BGKnytHlRTKXe0JyVIQmWSEVmQ=",
          "cache": "force-cache"
        }
      ],
      "fi": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.xu7u693ahd.wasm",
          "integrity": "sha256-Sb0fzqWupDEpo36vyqpq5Z9OzooWvjY9uE/8XOH27v0=",
          "cache": "force-cache"
        }
      ],
      "fil": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.j0djt3mrd2.wasm",
          "integrity": "sha256-oxHWjncLEzYGd8jAlYNG97xlDA2k8dKqZ/rE/6vaY0Y=",
          "cache": "force-cache"
        }
      ],
      "fr": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.t3fq017f66.wasm",
          "integrity": "sha256-+aKaaeS4UXFz101ngPnV/2Ig54+XuuxJ3eDgpY1q0kE=",
          "cache": "force-cache"
        }
      ],
      "ga": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.qpa7fs5sit.wasm",
          "integrity": "sha256-Ah9wEcRgqiqVNIdSjSaV7/lOGfXwMW4hLPsCRnroD5k=",
          "cache": "force-cache"
        }
      ],
      "gu": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.pmk6x96mpj.wasm",
          "integrity": "sha256-8RLbHbxpVm5S3hI6s9ma9uLHEh8SWOc41MiW3Jagtnk=",
          "cache": "force-cache"
        }
      ],
      "he": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ljythtoc5m.wasm",
          "integrity": "sha256-3+awPT6+RrGTerE8UsN2EhXyqRNXQkwXXRKQ7ln4E4s=",
          "cache": "force-cache"
        }
      ],
      "hi": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.cy8nefhbym.wasm",
          "integrity": "sha256-7DgiGgNXbnO0HlfKLAGStJHkxlilbn9Uv8pne7NF6rg=",
          "cache": "force-cache"
        }
      ],
      "hr": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.gezc6aukmn.wasm",
          "integrity": "sha256-yLNvXTPjiPnvOe04rVubN1mAg6aM0kAca93G1oY8Rvw=",
          "cache": "force-cache"
        }
      ],
      "hu": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.1fofzu7j37.wasm",
          "integrity": "sha256-XZTyAeIegsBnQjKIdtbYsi2MnhvhJLzm7r/q+z6t8x4=",
          "cache": "force-cache"
        }
      ],
      "hy": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.1i2gl6fnto.wasm",
          "integrity": "sha256-V9KDZrGO83zjKZHC/0ibDTKXPjyHAV8DwRDUZ/vri3g=",
          "cache": "force-cache"
        }
      ],
      "id": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.cziyiylvx9.wasm",
          "integrity": "sha256-mL7aKkZEEplb6Ghp5O7D4SVhX0uKn/tD0m2MpHHJ3lE=",
          "cache": "force-cache"
        }
      ],
      "is": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.4uk908t899.wasm",
          "integrity": "sha256-RD4wflevrHn1LsvNUYdyO9RA2VK+b37bMfjcrDD08xs=",
          "cache": "force-cache"
        }
      ],
      "it": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ir3p1x9nf6.wasm",
          "integrity": "sha256-sgtPmDPOhZzuZBaO7aOUgUwT8c9VR0sTx/sS1xcqT90=",
          "cache": "force-cache"
        }
      ],
      "ja": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.tz676uxtsn.wasm",
          "integrity": "sha256-KW0U6+Snhmw9DOM78Hg7jARUPBpq/9CywKavOjaLTiI=",
          "cache": "force-cache"
        }
      ],
      "ka": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.0zuanmtxb5.wasm",
          "integrity": "sha256-TFopWoQkOS9Jgf8NsxIHyMK0tjjHIacWcxKpYtIJlkk=",
          "cache": "force-cache"
        }
      ],
      "kk": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.obsv2hxazr.wasm",
          "integrity": "sha256-JFeNhTEfDbJw+O/VMQH4T/DtlwlhAWS8/P6mi6rBX2s=",
          "cache": "force-cache"
        }
      ],
      "kn": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.d8c1pxi3id.wasm",
          "integrity": "sha256-006vAKTq9fjcv1eSwXevsPcJvRehHir7uuMUVeha2iA=",
          "cache": "force-cache"
        }
      ],
      "ko": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.5t8tscl1yb.wasm",
          "integrity": "sha256-2a1abHls+Uc4+soi2MUwTBchbERkCwaZ+VWWns75Jj0=",
          "cache": "force-cache"
        }
      ],
      "ky": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.93uv5ldguz.wasm",
          "integrity": "sha256-6+xHETxWFb7MkMtmxrZRANDQE8sFjLrx54guiCjipkw=",
          "cache": "force-cache"
        }
      ],
      "lb": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.8ts9fpdhqp.wasm",
          "integrity": "sha256-HH01ezk/eyd1bw+D6Ymm9SWzi3cnFLl2G6J6IUkZHsw=",
          "cache": "force-cache"
        }
      ],
      "lt": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.yi7d821m2f.wasm",
          "integrity": "sha256-prit8Sj9wAnLm1AtTGdHq/lHJ+S1zyaFQwgb2tSTJJ8=",
          "cache": "force-cache"
        }
      ],
      "lv": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.13syfv50hg.wasm",
          "integrity": "sha256-U6JQABcCTInE1NgJnUxS5VCJh2tzy+TRYvFG9e0/+PI=",
          "cache": "force-cache"
        }
      ],
      "mk": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.rmkkqu2wqj.wasm",
          "integrity": "sha256-c1eknTQ+QEtbPEY1/m+Dhj03Jt7Nv7pYhAM1uyD9zPw=",
          "cache": "force-cache"
        }
      ],
      "ml": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.65xse3p8cn.wasm",
          "integrity": "sha256-yuDdGIc7i7QBjrsJB8Nw5U9CEJ47feWSH0SCOtDiEA0=",
          "cache": "force-cache"
        }
      ],
      "mn": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.3snh13y0dd.wasm",
          "integrity": "sha256-XcCI/Zpw+ki5kE2RhjrKYKdCO5GpgDmmkSQByXLVyS8=",
          "cache": "force-cache"
        }
      ],
      "mr": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ewgsoind2o.wasm",
          "integrity": "sha256-cmu/zP97KNmG0lTa9TSJ6ZJC5KbND3xXbQ8CMFEi7QY=",
          "cache": "force-cache"
        }
      ],
      "ms": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.n1s0o6wu48.wasm",
          "integrity": "sha256-+/1Y0myaFw0nfM0ga60Pdd9Fd2bdZrtiXGe2rfxSTBY=",
          "cache": "force-cache"
        }
      ],
      "mt": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.rxw65ud37n.wasm",
          "integrity": "sha256-P9k1obCHkn5s4SP8l1h3ybrWPgA2xWRNPl1LfcsCyIo=",
          "cache": "force-cache"
        }
      ],
      "nl": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.b3mjxeqn1x.wasm",
          "integrity": "sha256-afBa3AKSoeKBwzUAgUsAlVNgEQbhqY09HaQ4HT32tfo=",
          "cache": "force-cache"
        }
      ],
      "no": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.alh5dlkrwf.wasm",
          "integrity": "sha256-TomK3PwMbAtBJvqmex5TtBHlwlC9ik744wN4mvchJdY=",
          "cache": "force-cache"
        }
      ],
      "pa": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.dv4fkjxl4d.wasm",
          "integrity": "sha256-adbJC2e+HcV/I9L0GX3KygmoiAdzgDes5md1E7whk2I=",
          "cache": "force-cache"
        }
      ],
      "pl": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.14d91cubce.wasm",
          "integrity": "sha256-oZukw+4ZGp0sKrBsMoCXzatCEH2CqejHlIDr0W1gbAQ=",
          "cache": "force-cache"
        }
      ],
      "pt": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.1efa3pa53s.wasm",
          "integrity": "sha256-l8ywL2M9xtfE7SS6XQAPor4dnYaBuu3IrdwosVnEc8U=",
          "cache": "force-cache"
        }
      ],
      "ro": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.9qi8uspuf2.wasm",
          "integrity": "sha256-0e57uHnHoVQxa1auq9IHlQqlV3ABT9lY3UIZqVL3SLk=",
          "cache": "force-cache"
        }
      ],
      "ru": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.5tm4ygos95.wasm",
          "integrity": "sha256-h5FVGNB2byOYkNuDeM4USP2lm8jpeEw4XRrZxT8Vbvw=",
          "cache": "force-cache"
        }
      ],
      "rw": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.afipqv925p.wasm",
          "integrity": "sha256-hm+zARryfUlGjGPuJYwbpBdtgOBt9bTD7oH6VKy4l1c=",
          "cache": "force-cache"
        }
      ],
      "si": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.g0v14bcnrd.wasm",
          "integrity": "sha256-wJxnkpSsFS6QXMXRZVkI3CDlbVQ5YxGbQjxR6q8nHr8=",
          "cache": "force-cache"
        }
      ],
      "sk": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.yy598liyqi.wasm",
          "integrity": "sha256-eqKooOZSIJ93u6Le0TafHqD3RShqXbwxDX8aTNbSj1A=",
          "cache": "force-cache"
        }
      ],
      "sl": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.qkbgphjwp4.wasm",
          "integrity": "sha256-ZpR/I5Mh/MTbR/uwruFHP2404Z1iWOT2MPGAHLJ+9sM=",
          "cache": "force-cache"
        }
      ],
      "so": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.z9unbvslga.wasm",
          "integrity": "sha256-+T9C78cfdIDSid60s0YQbWQI25fY4Gcb5Ys9Jklxryc=",
          "cache": "force-cache"
        }
      ],
      "sq": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.qogvad5cbs.wasm",
          "integrity": "sha256-xqud2W9PnTTniMZsMNALCbVOb6YsRIbkB21CHVpEpeI=",
          "cache": "force-cache"
        }
      ],
      "sr": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.n87jd4asng.wasm",
          "integrity": "sha256-ZwiSB9Inab4Zcz4CJjtoVb4z2VyH6i1glHsgxShtyZ4=",
          "cache": "force-cache"
        }
      ],
      "sv": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.pg1b7a0yfm.wasm",
          "integrity": "sha256-KSvh93eqQzNG8jr4D+6MOrCibTW9n3b7uIoSRPho9M8=",
          "cache": "force-cache"
        }
      ],
      "sw": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.pp0ge7m72g.wasm",
          "integrity": "sha256-Yy5io+qwqYWaPsshzLj7TNw5cHqtbAD36ZYBiQRptAc=",
          "cache": "force-cache"
        }
      ],
      "ta": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.veiczt51g9.wasm",
          "integrity": "sha256-yfCzqzYl9qjeW+VHyvxisHrqJy7OpbpzNnGqdaVQuKA=",
          "cache": "force-cache"
        }
      ],
      "te": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.pm2qxz1ta5.wasm",
          "integrity": "sha256-0QxP5V41WUg0MFrydMcyVqBZbYVF+4UEa5NO/yfSWVU=",
          "cache": "force-cache"
        }
      ],
      "tg": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.pyll8bocfr.wasm",
          "integrity": "sha256-jwkfDr340ZylBZNBMvBJ53/JMVnXn8ZgapoiI2WNg3o=",
          "cache": "force-cache"
        }
      ],
      "th": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.8ibw9brue1.wasm",
          "integrity": "sha256-QOd2em9u0010fKgBAtdglnPbh0c/TdoWrCgcO0mpa1U=",
          "cache": "force-cache"
        }
      ],
      "tk": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.fyrp74hj1k.wasm",
          "integrity": "sha256-Od9vaW51uwf7rzIZ/EVIANvYbWdXxeeTbKng1NnfIj4=",
          "cache": "force-cache"
        }
      ],
      "tr": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.rqb65f1mgz.wasm",
          "integrity": "sha256-89GImn/tEDEX9RW36xNh+koSPjCnDpeqrWRL30A0e8k=",
          "cache": "force-cache"
        }
      ],
      "uk": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ceghoueub6.wasm",
          "integrity": "sha256-RB2UIgebC/ROFNf0upoCGwaDxnudeI/0LmQ4HI/kWmA=",
          "cache": "force-cache"
        }
      ],
      "ur": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.9oqjuydqyu.wasm",
          "integrity": "sha256-N/zGh/SHQUr6YYB+yKPBbzABab/rFHBTwh0ZELwrrWM=",
          "cache": "force-cache"
        }
      ],
      "uz": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.4qyjuwkzue.wasm",
          "integrity": "sha256-dGuWtjcZ7eKf51/9cwLVk6NQ/a3ZFZumadE23vf8sso=",
          "cache": "force-cache"
        }
      ],
      "vi": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.5dxvcgyztp.wasm",
          "integrity": "sha256-V5m3KUnD5pjrMujR/NmB/lQXGm4gP/aIFagWt49Fpss=",
          "cache": "force-cache"
        }
      ],
      "xh": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.69tkt5qiyd.wasm",
          "integrity": "sha256-5p1WmNwp/imzDEG0OEiVcOWdWLD+EK+Yw1RS7GrE/eY=",
          "cache": "force-cache"
        }
      ],
      "zh": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.l2grlt7toh.wasm",
          "integrity": "sha256-HQN1o9DE8eYcYy0HH3atm6d+0Z2bxg9IJMnvzmA/SHo=",
          "cache": "force-cache"
        }
      ],
      "zu": [
        {
          "virtualPath": "KOAI.Core.resources.wasm",
          "name": "KOAI.Core.resources.ixfrxmmtl8.wasm",
          "integrity": "sha256-ZgIp+WAZeyMXNsRFm0B+l6AexB5wH7pO7nD3ucpMFiA=",
          "cache": "force-cache"
        }
      ]
    }
  },
  "debugLevel": 0,
  "linkerEnabled": true,
  "globalizationMode": "sharded",
  "extensions": {
    "blazor": {}
  },
  "runtimeConfig": {
    "runtimeOptions": {
      "configProperties": {
        "Microsoft.AspNetCore.Components.Routing.RegexConstraintSupport": false,
        "MVVMTOOLKIT_ENABLE_INOTIFYPROPERTYCHANGING_SUPPORT": true,
        "Microsoft.Extensions.DependencyInjection.VerifyOpenGenericServiceTrimmability": true,
        "System.ComponentModel.DefaultValueAttribute.IsSupported": false,
        "System.ComponentModel.Design.IDesignerHost.IsSupported": false,
        "System.ComponentModel.TypeConverter.EnableUnsafeBinaryFormatterInDesigntimeLicenseContextSerialization": false,
        "System.ComponentModel.TypeDescriptor.IsComObjectDescriptorSupported": false,
        "System.Data.DataSet.XmlSerializationIsSupported": false,
        "System.Diagnostics.Debugger.IsSupported": false,
        "System.Diagnostics.Metrics.Meter.IsSupported": false,
        "System.Diagnostics.Tracing.EventSource.IsSupported": false,
        "System.GC.Server": true,
        "System.Globalization.Invariant": false,
        "System.TimeZoneInfo.Invariant": false,
        "System.Linq.Enumerable.IsSizeOptimized": true,
        "System.Net.Http.EnableActivityPropagation": false,
        "System.Net.Http.WasmEnableStreamingResponse": true,
        "System.Net.SocketsHttpHandler.Http3Support": false,
        "System.Reflection.Metadata.MetadataUpdater.IsSupported": false,
        "System.Resources.ResourceManager.AllowCustomResourceTypes": false,
        "System.Resources.UseSystemResourceKeys": true,
        "System.Runtime.CompilerServices.RuntimeFeature.IsDynamicCodeSupported": true,
        "System.Runtime.InteropServices.BuiltInComInterop.IsSupported": false,
        "System.Runtime.InteropServices.EnableConsumingManagedCodeFromNativeHosting": false,
        "System.Runtime.InteropServices.EnableCppCLIHostActivation": false,
        "System.Runtime.InteropServices.Marshalling.EnableGeneratedComInterfaceComImportInterop": false,
        "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
        "System.StartupHookProvider.IsSupported": false,
        "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
        "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": true,
        "System.Threading.Thread.EnableAutoreleasePool": false,
        "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.DisableThrowNavigationException": false
      }
    }
  }
}/*json-end*/);export{gt as default,ft as dotnet,mt as exit};
