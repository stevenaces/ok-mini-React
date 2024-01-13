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
			children: children.map((child) =>
				typeof child === "string" ? createTextNode(child) : child
			),
		},
	};
}

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

const App = createElement("div", { id: "app" }, "Hi ", "mini-react");
render(App, document.querySelector("#root"));
