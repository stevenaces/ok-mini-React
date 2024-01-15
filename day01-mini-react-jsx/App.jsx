import React from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "Hi ", "mini-react", "!");


function CountContainer(){
  return <>
    <Count num={10}></Count>
    <Count num={20}></Count>
  </>
}

function Count({num}) {
  return <div>count: {num}</div>
}

// function App(){
//   return <div>Hi mini-react! <CountContainer></CountContainer></div>
// }
const App = <div>Hi mini-react! <CountContainer></CountContainer></div>

// function AppOne() {
//   return <div>Hi mini-react!</div>
// }

console.log('App.jsx ',App);

// 暂时还不支持函数组件
// function App(){
//   return <div>Hi React function component</div>
// }

export default App;
