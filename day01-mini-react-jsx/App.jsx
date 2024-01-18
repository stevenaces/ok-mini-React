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

  function Foo() {
    return  <div>
              Foo
              <div>child1</div>
              <div>child2</div>
            </div>
  }
  const bar = <p>Bar</p>

  function handleClick() {
    showBar = !showBar
    React.update();
  }
  return  <div>
            Count
            <div>{showBar ? bar : <Foo></Foo>}</div>
            <button onClick={handleClick}>{showBar ? 'showFoo' : 'showBar'}</button>
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
