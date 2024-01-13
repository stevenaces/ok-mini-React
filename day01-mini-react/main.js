// console.log("main.js");

// v1
// const dom = document.createElement("div");
// dom.id = "app";
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = "app";
// dom.append(textNode);

// v2
// react -> vdom -> javascript object
// vdom: type, props, children
// const textEle = {
// 	type: "TEXT_ELEMENT",
// 	props: {
// 		nodeValue: "app",
// 		children: [],
// 	},
// };

// const el = {
// 	type: "div",
// 	props: {
// 		id: "app",
// 		children: [textEle],
// 	},
// };

// const dom = document.createElement(el.type);
// dom.id = el.props.id;
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = textEle.props.nodeValue;
// dom.append(textNode);

// v3 create vdom object function
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
			children,
		},
	};
}

const textNode = createTextNode("app");
const textNode2 = createTextNode(" mini-react");
const App = createElement("div", { id: "app" }, textNode, textNode2);

// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.querySelector("#root").append(dom);

// const textNodeEl = document.createTextNode("");
// textNodeEl.nodeValue = textNode.props.nodeValue;
// dom.append(textNodeEl);

// v4 dynamic create vdom and render
function render(el, container) {
	const dom =
		el.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(el.type);

	// 处理 props
	Object.keys(el.props).forEach((key) => {
		if (key !== "children") {
			dom[key] = el.props[key];
		}
	});

	// 处理 children
	el.props.children.forEach((e) => {
		render(e, dom);
	});

	container.append(dom);
}

render(App, document.querySelector("#root"));
