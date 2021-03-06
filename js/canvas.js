/* 
*
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
    // 初始化评价星级
    window.evaluation = null;
    window.evaluation_allowed = false;
    // 初始化评价者身份
    window.is_professional = 0;
    // 初始化当前页面文件名
    window.filename = null;
    // 修改评价星级
    $('.evaluation_icon').mouseover(function (e) {
        var index = parseInt(e.target.id.charAt(11));
        for (var i = 1; i < index + 1; i++) {
            document.getElementById("evaluation_" + i).src = "images/star_full.png";
        }
        for (var j = index+1; j < 6; j++) {
            document.getElementById("evaluation_" + j).src = "images/star_blank.png";
        }
        if (window.evaluation_allowed) {
            window.evaluation = index;
        }
    });
    //修改评价者身份
    $(".wide_button").click(function (e) {
        $(".wide_button").removeClass("chosen");
        e.target.className += " chosen";
        window.is_professional = e.target.id === "professional" ? 1 : 2;
    });
    // 提交评价星级
    $('.evaluation_icon').click(uploadEvaluation);
    $('.click_change_bgc').mousedown(function (e) {
        e.target.style.backgroundColor = "#00b0f0";
    });
    $('.click_change_bgc').mouseup(function (e) {
        e.target.style.backgroundColor = "lightgrey";
    });
}

// 封装绘制类
class Draw {
    constructor() {
        this.draw_state = null;
        this.is_down = false;
        this.input_canvas_1 = document.getElementById('input_canvas_1');
        this.input_canvas_2 = document.getElementById('input_canvas_2');
        this.input_canvas_3 = document.getElementById('input_canvas_3');
        this.output_canvas = document.getElementById('output_canvas');
        this.ctx_1 = this.input_canvas_1.getContext('2d');
        this.ctx_2 = this.input_canvas_2.getContext('2d');
        this.ctx_3 = this.input_canvas_3.getContext('2d');
        this.ctx_4 = this.output_canvas.getContext('2d');
        this.linear_start_point = null; // {x: null, y: null}
        this.linear_end_point = null; // {x: null, y: null}
        this.lineWidth = 0;
        this.fillColor = "";
        this.curve_start_point = null; // {x: null, y: null}
        this.curve_end_point = null; // {x: null, y: null}
        this.curve_quadratic_point = null; // {x: null, y: null}
        this.rect_x = null;
        this.rect_y = null;
        this.rect_end_x = null;
        this.rect_end_y = null;
        this.polygon_point_list = []; // [{x: null, y: null},{x: null, y: null}]
        this.draw_history = [];
        /*
            draw_history数组元素说明:
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
        this.img_history = [];
        /*
            img_history数组元素说明：
            [
                {
                    src_1: "",
                    src_2: ""
                },
            ]
            设想另一种撤回方案，将每一步的canvas状态使用toDataURL转为src存在img_history数组中，撤回时直接将对应image绘制在canvas上
        */
        this.curve_state = 0;
        this.polygon_state = 0;
        this.init = function () {
            // 初始化
            var _this = this;
            // 画笔功能切换
            document.getElementById("linear").addEventListener("click", function () {
                // $("#linear").removeClass("chosen");
                $("#curve").removeClass("chosen");
                $("#rectangle").removeClass("selected");
                $("#polygon").removeClass("selected");
                $("#linear").addClass("chosen");
                _this.state_change(1);
            });
            document.getElementById("curve").addEventListener("click", function () {
                $("#linear").removeClass("chosen");
                // $("#curve").removeClass("chosen");
                $("#rectangle").removeClass("selected");
                $("#polygon").removeClass("selected");
                $("#curve").addClass("chosen");
                _this.state_change(2);
            });
            document.getElementById("rectangle").addEventListener("click", function () {
                $("#linear").removeClass("chosen");
                $("#curve").removeClass("chosen");
                // $("#rectangle").removeClass("selected");
                $("#polygon").removeClass("selected");
                $("#rectangle").addClass("selected");
                _this.state_change(3);
            });
            document.getElementById("polygon").addEventListener("click", function () {
                $("#linear").removeClass("chosen");
                $("#curve").removeClass("chosen");
                $("#rectangle").removeClass("selected");
                // $("#polygon").removeClass("selected");
                $("#polygon").addClass("selected");
                _this.state_change(4);
            });
            // 绘图图例切换
            $("img.single_icon_1").click(function (e) {
                $("img.single_icon_1").removeClass("selected");
                e.target.className += " selected";
                _this.lineWidth = parseInt(e.target.id.slice(5));
            });
/*
            $("img.single_icon_2").click(function (e) {
                $("img.single_icon_2").removeClass("selected");
                e.target.className += " selected";
                _this.fillColor = e.target.id.slice(5);
            });
*/
            // 初始化画笔状态为直线
            _this.draw_state = 1;
            // 初始化画笔宽度为15px
            _this.lineWidth = 15;
            //初始化画笔填充颜色为黑色
            _this.fillColor = "black";
            // 添加鼠标事件监听
            _this.input_canvas_3.addEventListener("mousedown", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.linear_start_point = {
                        x: e.layerX,
                        y: e.layerY
                    };
                    _this.is_down = true;
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.curve_start_point = {
                            x: e.layerX,
                            y: e.layerY
                        }
                        _this.is_down = true;
                    }else if (_this.curve_state === 1) {
                        _this.is_down = true;
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        _this.drawCurve(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, e.layerX, e.layerY);
                    }else {
                        console.log("error");
                        return ;
                    }
                } else if (_this.draw_state === 3) {
                    _this.rect_x = e.layerX;
                    _this.rect_y = e.layerY;
                    _this.is_down = true;
                } else if (_this.draw_state === 4) {
                    return ;
                } else {
                    console.log("error");
                    return ;
                }
            });
            _this.input_canvas_3.addEventListener("mousemove", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === true) {
                        _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.linear_start_point.x, _this.linear_start_point.y, e.layerX, e.layerY);
                    }
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === true) {
                            _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, e.layerX, e.layerY);
                        }
                    } else if (_this.curve_state === 1) {
                        if (_this.is_down === true) {
                            _this.ctx_3.clearRect(0, 0, 256, 256);
                            _this.drawCurve(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, e.layerX, e.layerY);
                        }
                    } else {
                        console.log("error");
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === true) {
                        _this.drawRect(_this.ctx_3, _this.fillColor, _this.rect_x, _this.rect_y, e.layerX, e.layerY);
                    }
                } else if (_this.draw_state === 4) {
                    if (_this.polygon_state === 0) {
                        return ;
                    }else if (_this.polygon_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.polygon_point_list.length === 1) {
                            _this.drawLine(_this.ctx_3, 1, _this.fillColor, _this.polygon_point_list[0].x, _this.polygon_point_list[0].y, e.layerX, e.layerY);
                        }else if (_this.polygon_point_list.length > 1) {
                            _this.polygon_point_list.push({
                                x: e.layerX,
                                y: e.layerY
                            });
                            _this.drawPolygon(_this.ctx_3, _this.fillColor, _this.polygon_point_list);
                            _this.polygon_point_list.pop();
                        }else {
                            console.log("error");
                            return ;
                        }
                    }
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("mouseup", function (e) {
                e.preventDefault();
                if (_this.draw_state === 1) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === false) {
                        console.log("error");
                        return ;
                    }
                    _this.linear_end_point = {
                        x: e.layerX,
                        y: e.layerY
                    };
                    _this.drawLine(_this.ctx_2, _this.lineWidth, "#0000ff", _this.linear_start_point.x, _this.linear_start_point.y, _this.linear_end_point.x, _this.linear_end_point.y);
                    _this.is_down = false;
                    _this.draw_history.push({
                        drawType: "line",
                        lineWidth: _this.lineWidth,
                        start_point_x: _this.linear_start_point.x,
                        start_point_y: _this.linear_start_point.y,
                        end_point_x: _this.linear_end_point.x,
                        end_point_y: _this.linear_end_point.y,
                    });
                } else if (_this.draw_state === 2) {
                    if (_this.curve_state === 0) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === false) {
                            console.log("error");
                            return ;
                        }
                        _this.curve_end_point ={
                            x: e.layerX,
                            y: e.layerY
                        }
                        _this.drawLine(_this.ctx_3, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y);
                        _this.is_down = false;
                        _this.curve_state = 1;
                    } else if (_this.curve_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        if (_this.is_down === false) {
                            console.log("error");
                            return;
                        }
                        _this.curve_quadratic_point = {
                            x: e.layerX,
                            y: e.layerY
                        };
                        _this.drawCurve(_this.ctx_2, _this.lineWidth, "#0000ff", _this.curve_start_point.x, _this.curve_start_point.y, _this.curve_end_point.x, _this.curve_end_point.y, _this.curve_quadratic_point.x, _this.curve_quadratic_point.y);
                        _this.is_down = false;
                        _this.draw_history.push({
                            drawType: "curve",
                            lineWidth: _this.lineWidth,
                            start_point_x: _this.curve_start_point.x,
                            start_point_y: _this.curve_start_point.y,
                            end_point_x: _this.curve_end_point.x,
                            end_point_y: _this.curve_end_point.y,
                            cpx: _this.curve_quadratic_point.x,
                            cpy: _this.curve_quadratic_point.y,
                        });
                        _this.curve_state = 0;
                    } else {
                        console.log("error");
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    _this.ctx_3.clearRect(0, 0, 256, 256);
                    if (_this.is_down === false) {
                        console.log("error");
                        return ;
                    }
                    _this.rect_end_x = e.layerX;
                    _this.rect_end_y = e.layerY;
                    _this.drawRect(_this.ctx_1, _this.fillColor, _this.rect_x, _this.rect_y, _this.rect_end_x, _this.rect_end_y);
                    _this.is_down = false;
                    _this.draw_history.push({
                        drawType: "rectangle",
                        fillColor: _this.fillColor,
                        start_point_x: _this.rect_x,
                        start_point_y: _this.rect_y,
                        end_point_x: _this.rect_end_x,
                        end_point_y: _this.rect_end_y,
                    });
                } else if (_this.draw_state === 4) {
                    return ;
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("click", function (e) {
                e.preventDefault();
                if (_this.draw_state === 4) {
                    if (_this.polygon_state === 0) {
                        _this.polygon_state = 1;
                        _this.polygon_point_list.push({
                            x: e.layerX,
                            y: e.layerY
                        });
                    }else if (_this.polygon_state === 1) {
                        _this.polygon_point_list.push({
                            x: e.layerX,
                            y: e.layerY
                        });
                    }else {
                        console.log("error");
                        return ;
                    }
                } else if (_this.draw_state === 3) {
                    return ;
                } else if (_this.draw_state === 2) {
                    return ;
                } else if (_this.draw_state === 1) {
                    return;
                } else {
                    console.log("error");
                    return;
                }
            });
            _this.input_canvas_3.addEventListener("mouseleave", function (e) {
                e.preventDefault();
                if (_this.draw_state === 4) {
                    if (_this.polygon_state === 1) {
                        _this.ctx_3.clearRect(0, 0, 256, 256);
                        _this.drawPolygon(_this.ctx_1, _this.fillColor, _this.polygon_point_list);
                        _this.draw_history.push({
                            drawType: "polygon",
                            fillColor: _this.fillColor,
                            polygon_point_list: _this.polygon_point_list
                        });
                        _this.polygon_point_list = [];
                        _this.polygon_state = 0;
                    }else {
                        return;
                    }
                } else if (_this.draw_state === 3) {
                    return ;
                } else if (_this.draw_state === 2) {
                    return ;
                } else if (_this.draw_state === 1) {
                    return;
                } else {
                    console.log("error");
                    return;
                }
            });
            // 绑定撤回button
            document.getElementById("cancel").addEventListener("click", function () {_this.undo();});
            // 绑定清空button
            document.getElementById("clear").addEventListener("click", function () {_this.clearAll();});
            // 绑定提交button
            document.getElementById("transfer").addEventListener("click", function () {_this.upload();});
        };
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
        };
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
        };
        this.drawRect = function (ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y) {
            // 作矩形
            var rect_width = Math.abs(point_2_x - point_1_x);
            var rect_height = Math.abs(point_2_y - point_1_y);
            var start_point_x = point_1_x < point_2_x ? point_1_x : point_2_x;
            var start_point_y = point_1_y < point_2_y ? point_1_y : point_2_y;
            ctx.beginPath();
            ctx.fillStyle = ctx_color;
            ctx.fillRect(start_point_x, start_point_y, rect_width, rect_height);
            // ctx.closePath();
        };
        this.drawPolygon = function (ctx, ctx_color, polygon_point_list) {
            // 作多边形
            if (polygon_point_list.length < 3) {
                console.log("polygon_point_list error");
                return;
            }
            const point_1_x = polygon_point_list[0].x;
            const point_1_y = polygon_point_list[0].y;
            var point_2_x;
            var point_2_y;
            var point_3_x;
            var point_3_y;
            for (var i = 1; i < polygon_point_list.length - 1; i++) {
                point_2_x = polygon_point_list[i].x;
                point_2_y = polygon_point_list[i].y;
                point_3_x = polygon_point_list[i + 1].x;
                point_3_y = polygon_point_list[i + 1].y;
                this.drawTriangle(ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y);
                // 修复白线bug
                this.drawLine(ctx, 1, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y);
                this.drawLine(ctx, 1, ctx_color, point_1_x, point_1_y, point_3_x, point_3_y);
            }
        };
        this.drawTriangle = function (ctx, ctx_color, point_1_x, point_1_y, point_2_x, point_2_y, point_3_x, point_3_y) {
            // 作三角形
            ctx.beginPath();
            ctx.moveTo(point_1_x, point_1_y);
            ctx.lineTo(point_2_x, point_2_y);
            ctx.lineTo(point_3_x, point_3_y);
            ctx.closePath();
            ctx.fillStyle = ctx_color;
            ctx.fill();
        };
        this.upload = function () {
            // 上传图片
            var _this = this;
            $("#transfer_icon").show();
            this.ctx_3.fillStyle = "white";
            this.ctx_3.fillRect(0, 0, 256, 256);
            this.ctx_3.fillStyle = this.fillColor;
            for (var i = 0; i < this.draw_history.length; i++) {
                if (this.draw_history[i].drawType === "rectangle") {
                    this.drawRect(this.ctx_3, this.draw_history[i].fillColor, this.draw_history[i].start_point_x, this.draw_history[i].start_point_y, this.draw_history[i].end_point_x, this.draw_history[i].end_point_y);
                }else if (this.draw_history[i].drawType === "polygon") {
                    this.drawPolygon(this.ctx_3, this.draw_history[i].fillColor, this.draw_history[i].polygon_point_list);
                }else {
                    continue;
                }
            }
            for (var j = 0; j < this.draw_history.length; j++) {
                if (this.draw_history[j].drawType === "line") {
                    this.drawLine(this.ctx_3, this.draw_history[j].lineWidth, "#0000ff", this.draw_history[j].start_point_x, this.draw_history[j].start_point_y, this.draw_history[j].end_point_x, this.draw_history[j].end_point_y);
                }else if (this.draw_history[j].drawType === "curve") {
                    this.drawCurve(this.ctx_3, this.draw_history[j].lineWidth, "#0000ff", this.draw_history[j].start_point_x, this.draw_history[j].start_point_y, this.draw_history[j].end_point_x, this.draw_history[j].end_point_y, this.draw_history[j].cpx, this.draw_history[j].cpy);
                }else {
                    continue;
                }
            }
            this.input_canvas_3.toBlob(function (blobObj) {
                var form = new FormData();
                form.append("img", blobObj);
                $.ajax({
                    url: "/upload",
                    type: "post",
                    processData: false,
                    contentType: false,
                    data: form,
                    success: function (data) {
                        if (data.status === 200) {
                            alert("上传成功。");
                            window.filename = data.msg;
                            window.evaluation_allowed = true;
                            _this.ctx_3.clearRect(0, 0, 256, 256);
                            $.ajax({
                                url: "/show/"+window.filename,
                                type: "get",
                                success: function (data) {
                                    var img = new Image();
                                    img.src = "/show/" + window.filename;
                                    img.onload = function () {
                                        _this.ctx_4.drawImage(img, 0, 0, 256, 256);
                                        $("#transfer_icon").hide();
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    $("#transfer_icon").hide();
                                    alert("图片获取失败。");
                                    console.log(textStatus);
                                    return ;
                                }
                            });
                        }else if (data.status === -100) {
                            $("#transfer_icon").hide();
                            alert("图片上传失败。");
                        }else if (data.status === -999) {
                            $("#transfer_icon").hide();
                            alert("系统错误。");
                        }
                    }
                })
            });
        };
        this.undo = function () {
            // 撤回
            this.ctx_1.clearRect(0, 0, 256, 256);
            this.ctx_2.clearRect(0, 0, 256, 256);
            this.ctx_3.clearRect(0, 0, 256, 256);
            this.draw_history.pop();
            this.trace(this.draw_history);
        };
        this.trace = function (draw_history) {
            //按照记录重绘canvas画布
            for (var i = 0; i < draw_history.length; i++) {
                var type = draw_history[i].drawType;
                switch (type) {
                    case "line":
                        this.drawLine(this.ctx_2, draw_history[i].lineWidth, "#0000ff", draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y);
                        break;
                    case "curve":
                        this.drawCurve(this.ctx_2, draw_history[i].lineWidth, "#0000ff", draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y, draw_history[i].cpx, draw_history[i].cpy);
                        break;
                    case "rectangle":
                        this.drawRect(this.ctx_1, draw_history[i].fillColor, draw_history[i].start_point_x, draw_history[i].start_point_y, draw_history[i].end_point_x, draw_history[i].end_point_y);
                        break;
                    case "polygon":
                        this.drawPolygon(this.ctx_1, draw_history[i].fillColor, draw_history[i].polygon_point_list);
                        break;
                }
            }
        };
        this.clearAll = function () {
            this.ctx_1.clearRect(0, 0, 256, 256);
            this.ctx_2.clearRect(0, 0, 256, 256);
            this.ctx_3.clearRect(0, 0, 256, 256);
            this.ctx_4.clearRect(0, 0, 256, 256);
            this.draw_history = [];
            this.img_history = [];
            window.is_professional = 0;
            window.evaluation = 0;
            $(".evaluation_icon").attr("src", "images/star_blank.png");
            $(".wide_button").removeClass("chosen");
        };
        this.state_change = function (state) {
            if (state !== 1 && state !== 2 && state !== 3 && state !== 4) {
                console.log("error");
                return;
            }
            this.draw_state = state;
        };
    }
}

// 检查浏览器的支持
function checkBrowser () {
    if (!FileReader || !FormData) {
        return false;
    }else {
        return true;
    }
}

// 提交评分
function uploadEvaluation () {
    if (window.evaluation_allowed === true && window.evaluation !== null && window.filename !== null) {
        if (window.is_professional === 0) {
            alert("请选择评价者身份。");
            return ;
        }
        var formData = new FormData();
        formData.append("filename", window.filename);
        formData.append("score", window.evaluation);
        formData.append("person", window.is_professional === 1 ? "professional" : "unprofessional");
        $.ajax({
            type: "post",
            url: "/score",
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                alert("评价提交成功。感谢您的评价！");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("评分失败，请重新评价。");
                console.log(textStatus);
            }
        });
    }else {
        alert("当前不可进行评分。");
        return ;
    }
}