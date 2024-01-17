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
	nextWorkUnit = {
		dom: container,
		props: {
			children: [el],
		},
	};
	root = nextWorkUnit;
}

let root = null;
function commitRoot() {
	console.log("commitRoot:", root);
	commitWork(root.child);
}

function commitWork(fiber) {
	if (!fiber) return;

	let fiberParent = fiber.parent;
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}

	if (fiber.dom) {
		fiberParent.dom.append(fiber.dom);
	}
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

let nextWorkUnit = null;
function workLoop(deadline) {
	let shouldYield = false;

	while (!shouldYield && nextWorkUnit) {
		nextWorkUnit = performWorkUnit(nextWorkUnit);
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextWorkUnit && root) {
		// 通过判断root，只允许提交一次
		// 统一提交
		commitRoot();
		root = null;
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
function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			if (key.startsWith("on")) {
				const eventType = key.slice(2).toLowerCase();
				dom.addEventListener(eventType, props[key]);
			} else {
				dom[key] = props[key];
			}
		}
	});
}

// 构建fiber链
function initChildren(fiber, children) {
	let prevChild = null;
	// console.log("initChildren:", fiber);
	children.forEach((child, index) => {
		const newFiber = {
			type: child.type,
			props: child.props,
			parent: fiber,
			child: null,
			sibling: null,
			dom: null,
		};
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}

function updateFunctionComponent(fiber) {
	// 构建 dom关系
	const children = [fiber.type(fiber.props)];
	initChildren(fiber, children);
}

function updateHostComponent(fiber) {
	if (!fiber.dom) {
		// 1. 创建dom
		const dom = (fiber.dom = createDom(fiber.type));

		// 【统一提交，防止渲染时被阻塞，影响用户体验】
		// fiber.parent.dom.append(dom);

		// 2. 处理props
		updateProps(dom, fiber.props);
	}

	// 3. 构建dom关系
	const children = fiber.props.children;
	initChildren(fiber, children);
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

const React = {
	render,
	createElement,
};

export default React;
