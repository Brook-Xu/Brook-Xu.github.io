/* 
* 1. 获取画布(3为实时跟踪画笔， 2为道路绘制， 1为区域绘制)
* 2. 获取画笔
* 3. 直线，起止点
* 4. 曲线，三点式
* 5. 矩形，对角线起止点
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
    document.getElementById("linear").addEventListener("click", function () {draw.state_change(1)});
    document.getElementById("curve").addEventListener("click", function () {draw.state_change(2)});
    document.getElementById("rectangle").addEventListener("click", function () {draw.state_change(3)});
    document.getElementById("polygon").addEventListener("click", function () {draw.state_change(4)});
    // 绘图图例切换
    $("img.single_icon_1").click(function (e) {
        $("img.single_icon_1").removeClass("selected");
        e.target.className += " selected";
        draw.lineWidth = parseInt(e.target.id.slice(5));
    });
    $("img.single_icon_2").click(function (e) {
        $("img.single_icon_2").removeClass("selected");
        e.target.className += " selected";
        draw.color = e.target.id.slice(5);
    });
    // 初始化评价星级
    var evaluation = null;
    // 修改评价星级
    $('.evaluation_icon').mouseover(function (e) {
        var index = parseInt(e.target.id.charAt(11));
        for (var i = 1; i < index + 1; i++) {
            document.getElementById("evaluation_" + i).src = "images/star_full.png";
        }
        for (var j = index+1; j < 6; j++) {
            document.getElementById("evaluation_" + i).src = "images/star_blank.png";
        }
        evaluation = index;
    });
}

// 封装绘制类
function Draw () {
    this.draw_state = null;
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
    this.color = "";
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
        [
            {
                drawType: "line",
                lineWidth: 6 | 10 | 15,
                start_point_x: null,
                start_point_y: null,
                end_point_x: null,
                end_point_y: null,
            },
            {
                drawType: "curve",
                lineWidth: 6 | 10 |15,
                start_point_x: null,
                start_point_y: null,
                end_point_x: null,
                end_point_y: null,
                cpx: null,
                cpy: null,
            },
            {
                drawType: "rectangle",
                fillColor: "",
                start_point_x: null,
                start_point_y: null,
                end_point_x: null,
                end_point_y: null,
            },
            {
                drawType: "polygon",
                fillColor: "",
                polygon_point_list: [],
            }
        ]
    */

    this.init = function () {
        // 初始化
    }

    this.drawLine = function (ctx, ctx_width, ctx_color, start_point_x, start_point_y, end_point_x, end_point_y) {
        // 作直线
        // ctx_color = "#0000ff";
        ctx.beginPath();
        ctx.moveTo(start_point_x, start_point_y);
        ctx.lineTo(end_point_x, end_point_y);
        ctx.lineWidth = ctx_width;
        ctx.strokeStyle = ctx_color;
        ctx.stroke();
        // ctx.closePath();
    }

    this.drawCurve = function (ctx, ctx_width, ctx_color, start_point_x, start_point_y, end_point_x, end_point_y, cpx, cpy) {
        // 作曲线
        // ctx_color = "#0000ff";
        ctx.beginPath();
        ctx.moveTo(start_point_x, start_point_y);
        ctx.quadraticCurveTo(cpx, cpy, end_point_x, end_point_y);
        ctx.lineWidth = ctx_width;
        ctx.strokeStyle = ctx_color;
        ctx.stroke();
        // ctx.closePath();
    }

    this.drawRect = function (ctx, ctx_color, start_point_x, start_point_y, end_point_x, end_point_y) {
        // 作矩形
        var rect_width = Math.abs(end_point_x - start_point_x);
        var rect_height = Math.abs(end_point_y - start_point_y);
        ctx.beginPath();
        ctx.fillStyle = ctx_color;
        ctx.fillRect(start_point_x, start_point_y, rect_width, rect_height);
        // ctx.closePath();
    }

    this.drawPolygon = function (ctx, ctx_color, polygon_point_list) {
        // 作多边形
        if (polygon_point_list.length < 3) {
            console.log("polygon_point_list error");
            return ;
        }
        const point_1_x = polygon_point_list[0].x;
        const point_1_y = polygon_point_list[0].y;
        var point_2_x;
        var point_2_y;
        var point_3_x;
        var point_3_y
        for (var i = 1; i < polygon_point_list.length - 1; i++) {
            point_2_x = polygon_point_list[i].x;
            point_2_y = polygon_point_list[i].y;
            point_3_x = polygon_point_list[i+1].x;
            point_3_y = polygon_point_list[i+1].y;
            this.drawTriangle(ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y);
        }
    }

    this.drawTriangle = function (ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y) {
        // 作三角形
        ctx.beginPath();
        ctx.moveTo(point_1_x, point_1_y);
        ctx.lineTo(point_2_x, point_2_y);
        ctx.lineTo(point_3_x, point_3_y);
        ctx.closePath();
        ctx.fillStyle = ctx_color;
        ctx.fill();
    }

    this.upload = function () {
        // 上传图片
    }

    this.undo = function () {
        // 撤回
        this.history.pop();
        this.trace(this.history);
    }

    this.trace = function (history) {
        //跟踪重绘canvas画布
        for (var i = 0; i < history.length; i++) {
            var type = history[i].drawType;
            switch (type) {
                case "line": this.drawLine(this.ctx_2, history[i].lineWidth, "#0000ff", history[i].start_point_x, history[i].start_point_y, history[i].end_point_x, history[i].end_point_y);
                break;
                case "curve": this.drawCurve(this.ctx_2, history[i].lineWidth, "#0000ff", history[i].start_point_x, history[i].start_point_y, history[i].end_point_x, history[i].end_point_y, history[i].cpx, history[i].cpy);
                break;
                case "rectangle": this.drawRect(this.ctx_1, history[i].fillColor, history[i].start_point_x, history[i].start_point_y, history[i].end_point_x, history[i].end_point_y);
                break;
                case "polygon": this.drawPolygon(this.ctx_1, history[i].fillColor, history[i].polygon_point_list);
                break;
            }
        }
    }

    this.state_change = function (state) {
        this.draw_state = state;
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

// 提交评分
function uploadEvaluation () {
    if (evaluation === null) {
        return ;
    }
}