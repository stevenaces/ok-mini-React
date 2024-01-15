import React from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "Hi ", "mini-react", "!");
const App = <div>Hi mini-react!<p>a line</p><p>another line</p></div>;

// function AppOne() {
//   return <div>Hi mini-react!</div>
// }

console.log(App);

// 暂时还不支持函数组件
// function App(){
//   return <div>Hi React function component</div>
// }

export default App;
