// ==UserScript==
// @name         toc
// @namespace    http://tampermonkey.net/
// @description  add heading toc to all website
// @author       liangxoingsl
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docschina.org
// @include		*
// @grant       none

// @version		0.2
// @updateURL	https://github.com/lx-workspace/tampermonkey-scripts/blob/main/toc.js?raw=
// ==/UserScript==

// https://react.docschina.org/*

(function() {
	let up = ()=>{
		// document.body.querySelectorAll('.toc').forEach(v=>v.remove())
		let el = document.body.querySelector('.toc') || document.createElement('div')

		if (el.getAttribute('data-path') !== location.pathname){
			console.log(el.getAttribute('data-path'), location.pathname)
			el.setAttribute('data-path', location.pathname)
			el.style.width = '200px'
// el.style.height = '400px'
			el.style.position = 'fixed'
			el.style.right = '20px'
			el.style.top = '100px'
			el.className = 'toc'
			el.style.background = '#f5f5f5'
			el.style.borderRadius = '2px'
			el.style.border = '10px'
			el.style.borderColor = 'black'
			el.style.zIndex = '1000'
			el.style.borderRadius = '10px'
			el.style.padding = '8px'
			el.style.boxShadow = '#f6f6f6'
			el.style.marginBottom = '20px'
			el.innerHTML=''

			onkeydown = (e)=>{
				if (e.ctrlKey && e.shiftKey && e.key === 'd'){
					console.log(123)
					e.preventDefault()
				}
			}
			let toggle_main = ()=>{
				localStorage.setItem('disp-toc', el.style.display==='none')
				el.style.display = el.style.display==='none' ? 'block' : 'none'
			}
			if (localStorage.getItem('disp-toc') !== 'true'){
				toggle_main()
			}

			let bar = document.createElement('div')
			bar.style.height = '20px'
			bar.style.textAlign = 'center'
			bar.style.cursor = 'pointer'
			bar.style.margin = '4px 0px'
			bar.style.userSelect = 'none'
			bar.title = '折叠/展开 (ctrl+D)'
			bar.innerHTML = `<div style="transform: scaleX(500%)">&#x1f53d;</div>`
			bar.innerHTML = `&#x1f53d;`

			let x, y, dragging = false, just_drgged = false
			bar.addEventListener('click', ()=>{
				if (just_drgged){
					just_drgged = false
				}else {
					toggle_body()
				}
			})
			bar.addEventListener('mousedown', (e)=>{
				x = parseInt(el.style.left.substring(0,el.style.left.length-2)) - e.clientX
				y = parseInt(el.style.top.substring(0,el.style.top.length-2)) - e.clientY
				dragging = true
			})
			let mv = (e)=>{
				el.style.left = `${x+e.clientX}px`
				el.style.top = `${y+e.clientY}px`
			}
			addEventListener('mousemove', (e)=>{
				if (dragging){
					mv(e)
					just_drgged = true
				}
			})
			addEventListener('mouseup', ()=>{
				dragging = false
			})

			el.appendChild(bar)

			let ul = document.createElement('div')
			// 滚动条
			ul.style.maxHeight = '550px'
			ul.style.overflowY = 'auto'
			// ul.style.transition = 'all 2s'
			ul.style.transition = 'height 0.5s'
			let st = true
			let toggle_body = ()=>{
				st = !st
				// ul.style.display = st ? 'block' : 'none'
				ul.style.height = st ? '550px' : '0'
				bar.innerHTML = `&#x${st ? '1f53d' : '1f53c'};`
				localStorage.setItem('open-toc', st)
			}
			if (localStorage.getItem('open-toc') !== 'true'){
				toggle_body()
			}

			addEventListener('keydown', (e)=>{
				if (e.ctrlKey && e.key === 'd'){
					// toggle_body()
					toggle_main()
					e.preventDefault()
				}
			})

			// let title = document.body.querySelector('h1.mdx-heading')
			let title = document.body.querySelector('h1')
			let title_el = document.createElement('div')
			title_el.style.fontSize = '20px'
			title_el.style.fontWeight = '25px'
			title_el.style.cursor = 'pointer'
			// title_el.style.textAlign = 'center'
			title_el.innerHTML = title.innerText
			title_el.onclick =()=> location = `#${title.id}`
			ul.appendChild(title_el)
			ul.appendChild(document.createElement('hr'))

			// document.body.querySelectorAll('h2.mdx-heading, h3.mdx-heading').forEach(v=>{
			document.body.querySelectorAll('h2, h3').forEach(v=>{
				let a = document.createElement('a')
				let li = document.createElement('div')
				li.style.borderRadius = '10px'
				li.style.padding = '2px'
				li.style.fontSize = '14px'
				li.style.cursor = 'pointer'
				li.appendChild(a)
				a.innerHTML = v.innerText
				// a.style.marginLeft = '4px'
				if (v.tagName === 'H3'){
					li.style.marginLeft = '20px'
				}
				if (v.id){
					a.href = `#${v.id}`
				}

				a.style.display = 'block'
				li.onclick =()=> {
					if (v.id){
						// location = `#${v.id}`
					}else {
						// v.scrollIntoView({ behavior: 'smooth' })
						v.scrollIntoView()
					}
					scrollBy({top: -60})
				}
				li.onmouseover = ()=>li.style.background = '#e0e0e0'
				li.onmouseout = ()=>li.style.background = '#f5f5f5'
				ul.appendChild(li)
			})
			el.appendChild(ul)
			document.body.appendChild(el)
		}
	}
	up()
	let obs = new MutationObserver(up)
	obs.observe(document.body, { childList: true, subtree: true, characterData: true })




// let loc = document.location.pathname
// let go =()=>{
// 	let now_loc = document.location.pathname
// 	if (loc !== now_loc){
// 		loc = now_loc
//
// 		let obs = new MutationObserver(up)
// 		obs.observe(document.body, { childList: true, subtree: true, characterData: true })
// 	}
// }
// clearInterval(go)
// setInterval(go, 30)


})();
