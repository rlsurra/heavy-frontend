(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();const h="https://api.github.com/repos/marmelab/react-admin",p=()=>{const e=new Headers;e.append("Content-Type","application/x-www-form-urlencoded");const o=new Request(h,{headers:e});return fetch(o).then(s=>s.json())},f=document.getElementById("github-stars-content");if(f===null)throw new Error("github-stars-content element not found");const m=document.getElementById("github-stars-content-mobile");if(m===null)throw new Error("github-stars-content-mobile element not found");p().then(({stargazers_count:e})=>{f.innerText=e,m.innerText=e});window.addEventListener("scroll",()=>{const e=window.pageYOffset/(document.body.offsetHeight-window.innerHeight);document.body.style.setProperty("--scroll",`${e}`)},!1);const c=document.querySelector("nav button");if(c===null)throw new Error("navButton not found");const u=document.querySelector("#mobile-menu");if(u===null)throw new Error("mobileMenu not found");let d=!1;c.addEventListener("click",()=>{const[e,o]=Array.from(c.querySelectorAll("svg"));d?(e.classList.remove("hidden"),o.classList.add("hidden"),u.classList.add("hidden")):(o.classList.remove("hidden"),e.classList.add("hidden"),u.classList.remove("hidden")),d=!d});const n=[document.querySelector("#building-blocks > ul")];if(n[0]===null)throw new Error("buildingBlocksULs is empty");for(let e=0;e<5;e++){n.push(n[0].cloneNode(!0));for(let o=0;o<n[e].childElementCount;o++){const s=Math.floor(Math.random()*n[e].childElementCount),i=n[e].children[s];n[e].removeChild(i),n[e].appendChild(i)}e>2&&n[e].classList.add("md:hidden"),n[0].parentElement.appendChild(n[e])}for(let e=0;e<n.length;e++)n[e].classList.add(e%2===0?"justify-start":"justify-end"),n[e].style.animation="slide"+(e%2===0?"Left":"Right")+" 90s linear infinite";function y(){const e=document.getElementById("banner");e&&(e.style.display="none")}const a=document.getElementById("closeBanner");a&&a.addEventListener("click",e=>{e.preventDefault(),y()});
