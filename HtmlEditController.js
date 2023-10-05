
// 本质上是一个UIViewController
var HtmlEditController = JSB.defineClass('HtmlEditController : UIViewController', {
  // 视图加载
  viewDidLoad: function() {
    // 定义一个当前识图尺寸的webFrame
    var webFrame = self.view.bounds;
    // 初始化一个新的webview
    self.webView = new UIWebView(webFrame);
    // 允许网页进行缩放以适应屏幕
    self.webView.scalesPageToFit = true;
    // 设置自动布局规则
    self.webView.autoresizingMask = (1 << 1 | 1 << 4);
    // 设置webview的回调对象为自身
    self.webView.delegate = self;
    // 设置WebView内部的scrollView的回调对象也为自身
    self.webView.scrollView.delegate = self;
    // 将WebView添加到当前视图中
    self.view.addSubview(self.webView);
    // 生成一个临时的文件路径
    self.tempPath = Application.sharedInstance().tempPath + NSUUID.UUID().UUIDString();
    // 在此文件路径创建一个目录
    NSFileManager.defaultManager().createDirectoryAtPathWithIntermediateDirectoriesAttributes(self.tempPath,true,{});
    // 将Excalidraw复制到刚创建的目录
    NSFileManager.defaultManager().copyItemAtPathToPath(self.mainPath + '/Excalidraw',self.tempPath + '/Excalidraw');
  },
  // 视图将要显示时的回调方法
  viewWillAppear: function(animated) {
     // 初始化loaded为false，表示内容编译器未加载
    self.loaded = false;
     // 设置webView的回调对象为自身
    self.webView.delegate = self;
     // 设置视图和webView的背景色为应用的默认笔记本颜色
    self.view.backgroundColor = Application.sharedInstance().defaultNotebookColor;
    self.webView.backgroundColor = Application.sharedInstance().defaultNotebookColor;
     // 加载Excalidraw的html文件
    self.webView.loadFileURLAllowingReadAccessToURL(NSURL.fileURLWithPath(self.tempPath + '/Excalidraw/editor.html'),NSURL.fileURLWithPath(Application.sharedInstance().tempPath));
  },
  // 视图将要消失时的回调方法
  viewWillDisappear:  function(animated) {
    if(!self.loaded){
      self.retfunc({html:"没有loaded",dirty:false});        
      return;
    }
    self.webView.evaluateJavaScript(`excalidrawAPI.getSceneElements()`, function(elements) {
      if (elements!="[]"){
         // 在一个立即执行的异步函数表达式中使用 await
            self.webView.evaluateJavaScript(`
            (async function() {
              const result = await Excalidraw.getCanvas();
              window.myResult = result;
            })()
          `, function(ret) {
            });

            self.webView.evaluateJavaScript(`window.myResult`, function(html) {
              self.webView.evaluateJavaScript('ExcalidrawLib.serializeAsJSON(window.excalidrawAPI.getSceneElements(),"","","")',function(text){
                  self.webView.evaluateJavaScript('Excalidraw.calculateSize(excalidrawAPI.getSceneElements())',function(e){
                    var size = JSON.parse(e);
                    self.retfunc({text:text,html: '<img src='+html.toString()+' alt=""  />', dirty:true, size: size});
              })
            }) 
            });
      }
    })


  
  
    self.webView.delegate = null;
  },
  viewWillLayoutSubviews: function() {
    if(self.loaded){
    }
  },
  scrollViewDidScroll: function() {
  },
  webViewDidStartLoad: function(webView) {
  },
  webViewDidFinishLoad: function(webView) {
    //改变 self.loaded 的状态，表示 WebView 已完成加载。
    self.loaded = true;
    NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(timer){
      var scp = "excalidrawAPI.updateScene(JSON.parse('"+self.text.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"")+"'))";
      self.webView.evaluateJavaScript(scp);
    });
  },
  webViewDidFailLoadWithError: function(webView, error) {
  },
});


