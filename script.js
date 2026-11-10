document.getElementById("year").textContent=new Date().getFullYear();
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".topbar nav");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
const targets=document.querySelectorAll(".statement-content,.project,.experience-row,.skills>div,.contact h2");
targets.forEach(el=>el.classList.add("reveal"));
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});targets.forEach(el=>observer.observe(el));}else{targets.forEach(el=>el.classList.add("visible"));}