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
	console.log("creatElement jsx");
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

const React = {
	render,
	createElement,
};

export default React;
