/* 
* 1. 获取画布
* 2. 获取画笔
* 3. 直线，起止点
* 4. 曲线，三点式
* 5. 矩形，起止点
* 6. 多边形，三角形拼接
* 7. 撤回/清空
* 8. 跟踪鼠标变化
* 9. 评价
* 10. 帮助
* 注： 线条宽度像素：15/10/6px
*/

window.onload = function () {
    // 检查浏览器支持
    if (!this.checkBrowser()) {
        alert('当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。');
        document.body.innerHTML = "当前浏览器不支持canvas画布功能。请使用其他浏览器打开。推荐使用chrome浏览器。";
        return ;
    }
    // 初始化绘制工具
    var draw = new Draw();
    draw.init();
}

// 封装绘制类
function Draw () {
    this.is_down = false;
    this.input_canvas_1 = document.getElementById('input_canvas_1');
    this.input_canvas_2 = document.getElementById('input_canvas_2');
    this.input_canvas_3 = document.getElementById('input_canvas_3');
    this.ctx_1 = this.input_canvas_1.getContext('2d');
    this.ctx_2 = this.input_canvas_2.getContext('2d');
    this.ctx_3 = this.input_canvas_3.getContext('2d');
    this.linear_start_point = null;
    this.linear_end_point = null;
    this.lineWidth = 0;
    this.curve_start_point = null;
    this.curve_end_point = null;
    this.curve_quadratic_point = null;
    this.rect_x = null;
    this.rect_y = null;
    this.rect_end_x = null;
    this.rect_end_y = null;
    this.polygon_point_list = [];
    this.history = [];
    /* 
        history数组元素说明:
        {

        }
    */

    this.init = function () {
        // 初始化
    }

    this.drawLine = function () {
        // 作直线
    }

    this.drawCurve = function () {
        // 作曲线
    }

    this.drawRect = function () {
        // 作矩形
    }

    this.drawPolygon = function () {
        // 作多边形
    }

    this.upload = function () {
        // 上传图片
    }

    this.undo = function () {
        // 撤回
    }
}

// 检查浏览器的支持
function checkBrowser () {
    if (!FileReader) {
        return false;
    }else {
        return true;
    }
}