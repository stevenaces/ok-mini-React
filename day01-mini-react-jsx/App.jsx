import React from "./core/React.js";

let countFoo = 1;
function Foo(){
  console.log('Foo rerun');
  const update = React.update()
  function handleClick() {
    countFoo++;
    update()
  }
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countBar = 1;
function Bar(){
  console.log('Bar rerun');
  const update = React.update()
  function handleClick() {
    countBar++;
    update()
  }
  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countRoot = 1
function App(){
  console.log('app rerun');

  const update = React.update()
  function handleClick() {
    countRoot++;
    update()
  }

  return  <div>
            Hi mini-react! count: {countRoot}
            <button onClick={handleClick}>click</button>
            <Foo></Foo>
            <Bar></Bar>
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
