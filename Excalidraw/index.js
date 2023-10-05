 const { useState, useEffect } = React;

 var Excalidraw;



function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  useEffect(() => {
    window.excalidrawAPI = excalidrawAPI;
  }, [excalidrawAPI]);


  function calculateSize(elements) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for (const element of elements) {
      console.log(element)
      minX = Math.min(element.x, minX);
      minY = Math.min(element.y, minY);
      maxX = Math.max(element.x + element.width, maxX);
      maxY = Math.max(element.y + element.height, maxY);
    }
    
    return {
      width: maxX - minX+20,
      height: maxY - minY+20,
    };
  }

  async function getCanvas() {
    if (!excalidrawAPI) {
      console.log("not excalidrawAPI")
      return;
    }

    var elements = excalidrawAPI.getSceneElements();

    if (!elements || !elements.length) {
      return;
    }

    size = calculateSize(elements)
    

    var canvas = await ExcalidrawLib.exportToCanvas({
      elements: elements,
      // appState: {
      //   ...initialData.appState,
      //   exportWithDarkMode: false,
      // },
      files: excalidrawAPI.getFiles(),
      getDimensions: function () { return size },
      exportPadding:10,
    });
   

    return canvas.toDataURL()
  }

  

 

  React.useEffect(function() {
    // 更新全局 Excalidraw 中的 onClickButton 当 excalidrawAPI 改变时
    Excalidraw = { getCanvas: getCanvas,calculateSize:calculateSize };
  }, [excalidrawAPI]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div", 
      { style: { height: "400px" } }, 
      React.createElement(ExcalidrawLib.Excalidraw, { ref: setExcalidrawAPI })
    )
  )
}
window.exportToCanvas = ExcalidrawLib.exportToCanvas;
const excalidrawWrapper = document.getElementById("app");
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));



 

