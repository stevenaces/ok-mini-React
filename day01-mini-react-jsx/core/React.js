function createTextNode(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	};
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				const isTextNode =
					typeof child === "string" || typeof child === "number";
				return isTextNode ? createTextNode(child) : child;
			}),
		},
	};
}

function render(el, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [el],
		},
	};
	nextWorkOfUnit = wipRoot;
}

function commitRoot() {
	console.log("commitRoot:", wipRoot);
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
}

function commitWork(fiber) {
	if (!fiber) return;

	let fiberParent = fiber.parent;
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}

	if (fiber.effectTag === "update") {
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
	} else if (fiber.effectTag === "placement") {
		if (fiber.dom) {
			fiberParent.dom.append(fiber.dom);
		}
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

// work in progress
let wipFiber = null;
let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
	let shouldYield = false;

	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkUnit(nextWorkOfUnit);

		if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
			nextWorkOfUnit = undefined;
		}

		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextWorkOfUnit && wipRoot) {
		// 通过判断root，只允许提交一次
		// 统一提交
		commitRoot();
	}

	requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 创建dom
function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type);
}

// 处理props
function updateProps(dom, nextProps, prevProps) {
	// Object.keys(nextProps).forEach((key) => {
	// 	if (key !== "children") {
	//     if(key.startsWith('on')){
	//       const eventType = key.slice(2).toLowerCase()
	//       dom.addEventListener(eventType, nextProps[key])
	//     }else{
	// 		  dom[key] = nextProps[key];
	//     }
	// 	}
	// });

	// 1. old 有 new 没有 -> 删除
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key);
			}
		}
	});

	// 2. new 有 old 没有 -> 添加
	// 3. new 有 old 有 -> 修改
	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith("on")) {
					const eventType = key.slice(2).toLowerCase();
					dom.removeEventListener(eventType, nextProps[key]);
					dom.addEventListener(eventType, nextProps[key]);
				} else {
					dom[key] = nextProps[key];
				}
			}
		}
	});
}

// 构建fiber链
function reconcileChildren(fiber, children) {
	let prevChild = null;
	let oldFiber = fiber.alternate?.child;
	children.forEach((child, index) => {
		const isSameType = oldFiber && oldFiber.type === fiber.type;

		let newFiber;
		if (isSameType) {
			newFiber = {
				type: child.type,
				props: child.props,
				parent: fiber,
				child: null,
				sibling: null,
				dom: oldFiber.dom,
				alternate: oldFiber,
				effectTag: "update",
			};
		} else {
			newFiber = {
				type: child.type,
				props: child.props,
				parent: fiber,
				child: null,
				sibling: null,
				dom: null,
				effectTag: "placement",
			};
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}

function updateFunctionComponent(fiber) {
	stateHooks = [];
	stateHookIndex = 0;
	wipFiber = fiber;
	// 构建 dom关系
	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
	if (!fiber.dom) {
		// 1. 创建dom
		const dom = (fiber.dom = createDom(fiber.type));

		// 【统一提交，防止渲染时被阻塞，影响用户体验】
		// fiber.parent.dom.append(dom);

		// 2. 处理props
		updateProps(dom, fiber.props, {});
	}

	// 3. 构建dom关系
	const children = fiber.props.children;
	reconcileChildren(fiber, children);
}

function performWorkUnit(fiber) {
	const isFunctionComponent = typeof fiber.type === "function";

	if (!isFunctionComponent) {
		updateHostComponent(fiber);
	} else {
		updateFunctionComponent(fiber);
	}

	// 4. 返回下一个任务
	if (fiber.child) {
		return fiber.child;
	}

	// 多叉树最后一个儿子 找 (祖)叔
	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling;
		nextFiber = nextFiber.parent;
	}
}

function update() {
	wipRoot = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot,
	};
	console.log("update:", wipRoot);
	nextWorkOfUnit = wipRoot;
}

let stateHooks;
let stateHookIndex;
function useState(initial) {
	let currentFiber = wipFiber;

	const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

	const stateHook = {
		state: oldHook ? oldHook.state : initial,
		queue: oldHook ? oldHook.queue : [],
	};

	stateHook.queue.forEach((action) => {
		stateHook.state = action(stateHook.state);
	});

	stateHook.queue = [];

	stateHookIndex++;
	stateHooks.push(stateHook);

	currentFiber.stateHooks = stateHooks;

	function setState(action) {
		// stateHook.state = action(stateHook.state);
		stateHook.queue.push(typeof action === "function" ? action : () => action);

		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		};
		nextWorkOfUnit = wipRoot;
	}
	return [stateHook.state, setState];
}

const React = {
	update,
	render,
	useState,
	createElement,
};

export default React;
