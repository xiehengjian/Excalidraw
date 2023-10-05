JSB.newAddon = function(mainPath){ // 为JSB.newAddon实现了一个函数，接收一个mainPath的参数，该函数返回一个插件类
  JSB.require('HtmlEditController');// 引入依赖HtmlEditController
  // 定义一个插件类。
  // 这个类是扩展于JSExtension类的，因此需要实现各种实例方法。
  var newAddonClass = JSB.defineClass('MNExcalidraw : JSExtension', /*Instance members*/{
    //Window initialize 初始化窗口时调用
    sceneWillConnect: function() {
      // 将插件的hmtlController设置为HtmlEditController
      self.htmlController = HtmlEditController.new();
      // 将html控制器添加为学习控制器的子控制器
      // studyController要么就是学习模式，要么就是那个卡片。
      // 这样ck编辑器就属于卡片了
      Application.sharedInstance().studyController(self.window).addChildViewController(self.htmlController); //To fix 3.6.8 bug.
      // 设置mainpath
      self.htmlController.mainPath = mainPath;
      // 定义了一个函数，调用这个函数可以设置htmlController
      var setDditorFunc = function(html,text,respath,retfunc){
        self.htmlController.html = html;
        self.htmlController.text = text;
        self.htmlController.respath = respath;
        self.htmlController.retfunc = retfunc;
        return {'viewController':self.htmlController};
      };
      // 创建一个UI图标
      var image = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(mainPath + '/logo.png'),2);
      // 创建一个语言
      var lan = NSLocale.preferredLanguages().length?NSLocale.preferredLanguages()[0].substring(0,2):'en';
      // 创建标题
      var title = 'Excalidraw';
     // 注册了一个HTML的comment组件，comment组件应该就是卡片中的各种手写啊，打字啊，录音啊之类的。
      Application.sharedInstance().regsiterHtmlCommentEditor({title:title,image:image},setDditorFunc,null,'MNExcalidraw');
    },
    //Window disconnect 窗口断开时取消插件注册。
    sceneDidDisconnect: function() {
      self.htmlController.removeFromParentViewController();
      Application.sharedInstance().unregsiterHtmlCommentEditor('MNExcalidraw');
    },
    //Window resign active
    sceneWillResignActive: function() {
    },
    //Window become active
    sceneDidBecomeActive: function() {
    },
    notebookWillOpen: function(notebookid) {
    },
    notebookWillClose: function(notebookid) {
    },
    documentDidOpen: function(docmd5) {
    },
    documentWillClose: function(docmd5) {
    },
    controllerWillLayoutSubviews: function(controller) {
    },
  }, /*Class members*/{
    addonDidConnect: function() {
    },
    addonWillDisconnect: function() {
    },
    applicationWillEnterForeground: function() {
    },
    applicationDidEnterBackground: function() {
    },
    applicationDidReceiveLocalNotification: function(notify) {
    },
  });
  return newAddonClass;
};

