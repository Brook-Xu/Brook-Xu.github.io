/* 
* 1. 获取画布
* 2. 获取画笔
* 3. 直线，起止点
* 4. 曲线，三点式
* 5. 矩形，起止点
* 6. 撤回，
* 7. 跟踪鼠标变化
* 注： 线条宽度像素：15/10/6px
*/

window.onload = function () {
    if (!this.checkBrowser()) {
        alert('当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。');
        document.body.innerHTML = "当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。";
        return ;
    }
}

var DrawCanvas = new function () {
    this.start_point = null;
    this.end_point = null;
}

// 检查浏览器的支持
function checkBrowser () {
    if (!FileReader) {
        return false;
    }else {
        return true;
    }
}