import React from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "Hi ", "mini-react", "!");


function CountContainer(){
  return <>
    <Count num={10}></Count>
    {/* <Count num={20}></Count> */}
  </>
}

let showBar = false
function Count() {

  const bar = <div>bar</div>

  function handleShowBar() {
    showBar = !showBar
    React.update();
  }

  //通过 showBar 条件，控制渲染bar
  return  <div>
            Count
            {showBar && bar}
            <button onClick={handleShowBar}>showBar</button>
          </div>
}

function App(){
  return  <div>
            Hi mini-react! 
            <Count></Count>
          </div>
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
