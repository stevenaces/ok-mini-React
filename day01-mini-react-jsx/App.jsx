import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(0)
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    setCount((c) => c + 1)
    // setBar((c) => c+'bar')
    setBar('barbar')
  }
  return <div>
          <h1>Foo</h1> 
            <div>{count}</div>
            <div>{bar}</div>
            <button onClick={handleClick}>click</button>
          </div>
}

function App(){
  return <div>Hi mini-react! <Foo></Foo></div>
}


console.log('App.jsx ',App);

export default App;
