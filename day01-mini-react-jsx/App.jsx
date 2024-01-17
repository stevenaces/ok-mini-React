import React from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "Hi ", "mini-react", "!");


function CountContainer(){
  return <>
    <Count num={10}></Count>
    {/* <Count num={20}></Count> */}
  </>
}
let count = 10;
let props = {id: "1111"};
function Count() {
  function handleClick() {
    console.log('click');
    count++;
    props = {};
    React.update();
  }
  return <div {...props}>count: {count}<button onClick={handleClick}>click</button></div>
}

function App(){
  return <div>Hi mini-react! <Count></Count></div>
}
// const App = <div>Hi mini-react! <Count num={10}></Count></div>

// function AppOne() {
//   return <div>Hi mini-react!</div>
// }

console.log('App.jsx ',App);

// 暂时还不支持函数组件
// function App(){
//   return <div>Hi React function component</div>
// }

export default App;
