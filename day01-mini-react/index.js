// const el = document.createElement("div");
// el.innerHTML = "hi";

// document.body.append(el);

// let i = 1;
// while (i < 1000000000) {
// 	i++;
// }

// requestIdleCallback();

let taskId = 1;
function workLoop(deadline) {
	let shouldYield = false;
	taskId++;

	while (!shouldYield) {
		// run
		console.log(`taskId: ${taskId} run task`);

		// render dom

		shouldYield = deadline.timeRemaining() < 1;
	}

	requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
